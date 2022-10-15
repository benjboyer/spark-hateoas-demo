import groovy.json.JsonOutput
import groovy.transform.Field
import spark.Request
import spark.Response
import spark.Route
import spark.RouteImpl
import spark.routematch.RouteMatch

import java.util.function.Function
import java.util.stream.Collectors

@GrabConfig(systemClassLoader = true)
@Grab("org.slf4j:slf4j-simple:1.7.21")
@Grab("com.sparkjava:spark-core:2.9.4")
import static spark.Spark.*

port((System.getenv()["PORT"] ?: 8080) as int)
staticFiles.location("/public")

@Field
def users = [
        ben   : [
                name      : 'Ben',
                privileged: true
        ],
        xavier: [
                name      : 'Xavier',
                privileged: false
        ]
]

@Field
def current = users['ben']

@Field
Map<String, HATEOASRoute> relRoutes = [:]


path("/api/v1", () -> {

        get('',  new RelRoute(name: 'root', route: (req, res) -> {
                JsonOutput.toJson(getCurrentUserLinks())
        }))

        get('/whoami', new RelRoute(name: 'getWhoAmI', route: (req, res) -> {
                JsonOutput.toJson(getCurrentUser() + getCurrentUserLinks())
        }))

        get('/whoami/:name', new RelRoute(name: 'changeWhoAmI', route: (req, res) -> {
                def newName = req.params(':name')
                this.current = users[newName]
                JsonOutput.toJson(getCurrentUser() + getCurrentUserLinks())
        }))

        get('/privileged', new RelRoute(name: 'privileged', route: (req, res) -> {
        }))

        get('/debug', new RelRoute(name: 'debug', route: (req, res) -> {
                JsonOutput.toJson(relRoutes.values().collect { it.toLink() })
        }))
})

awaitInitialization()

this.relRoutes = routes().stream()
        .filter(r -> ((RouteImpl)r.getTarget()).delegate() instanceof RelRoute)
        .map(r -> new HATEOASRoute(r, (RelRoute)((RouteImpl)r.getTarget()).delegate()))
        .collect(Collectors.toMap(HATEOASRoute::getIndex, Function.identity()))

Map getCurrentUser() {
        return [whoami: this.current]
}

Map getCurrentUserLinks() {
        def dto = [
                links : [relRoutes['getWhoAmI'].toLink(), relRoutes['changeWhoAmI'].toLink()]
        ]

        if (this.current.privileged) {
                dto.links.add(relRoutes['privileged'].toLink())
        }

        return dto
}


class RelRoute implements Route {
        String name
        Route route

        @Override
        Object handle(Request request, Response response) throws Exception {
                return this.route.handle(request, response)
        }
}

class HATEOASRoute {
        private RouteMatch match
        private RelRoute rel

        String index
        private String href

        HATEOASRoute(RouteMatch match, RelRoute rel) {
                this.match = match
                this.rel = rel

                setIndex()
                setHref()
        }

        void setIndex() { this.index = rel.name }

        void setHref() {
                def rawParts = this.match.matchUri.split(':')

                if (rawParts.length == 1) {
                        this.href = this.match.matchUri
                        return
                }

                def parts = [rawParts[0].substring(0, rawParts[0].length() - 1)]
                for (i in 1..<rawParts.length) {
                        parts.add("\${${rawParts[i].replace('/', '')}}")
                }

                this.href = parts.join('/')
        }

        Map toLink() {
                [href:  this.href, rel: this.index, type: this.match.httpMethod.toString().toUpperCase()]
        }
}