import spark.RouteImpl
import spark.routematch.RouteMatch

import java.util.function.Function
import java.util.stream.Collectors

import static spark.Spark.routes

/**
 * Allows to generate an HATEOAS compliant link object based on a Spark route.
 */
class HATEOASRoute {

    private static Map<String, HATEOASRoute> relRoutes = null

    /**
     * Refreshes the {@link HATEOASRoute} cache.
     */
    static void refresh() {
        relRoutes = routes().stream()
                .filter(r -> ((RouteImpl)r.getTarget()).delegate() instanceof RelRoute)
                .map(r -> new HATEOASRoute(r, (RelRoute)((RouteImpl)r.getTarget()).delegate()))
                .collect(Collectors.toMap(HATEOASRoute::getIndex, Function.identity()))
    }

    /**
     * Get an existing {@link HATEOASRoute}
     * @param index the HATEOASRoute index
     * @return existing {@link HATEOASRoute} instance
     */
    static HATEOASRoute get(String index) {
        if (relRoutes == null) {
            refresh()
        }

        return relRoutes.get(index)
    }

    private RouteMatch match

    final RelRoute rel
    final String index
    final private String href

    HATEOASRoute(RouteMatch match, RelRoute rel) {
        this.match = match
        this.rel = rel

        this.index = rel.name
        this.href = resolveHref()
    }


    /**
     * Resolves the URI from Spark into a generic href with query path placeholders
     * @return the resolved href
     */
    String resolveHref() {
        def rawParts = this.match.matchUri.split(':')

        if (rawParts.length == 1) {
            return this.match.matchUri
        }

        def parts = [rawParts[0].substring(0, rawParts[0].length() - 1)]
        for (i in 1..<rawParts.length) {
            parts.add("\${${rawParts[i].replace('/', '')}}")
        }

        return parts.join('/')
    }

    /**
     * Generates a HATEOAS compliant link object
     * @return A map representation of a HATEOAS link
     */
    Map toLink() {
        [href:  this.href, rel: this.index, type: this.match.httpMethod.toString().toUpperCase()]
    }
}
