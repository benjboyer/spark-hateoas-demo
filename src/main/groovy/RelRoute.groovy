import spark.Request
import spark.Response
import spark.Route

import java.util.function.BooleanSupplier

/**
 * Allows to tag a Spark route with an index.
 */
class RelRoute implements Route {

    String name
    Route route
    BooleanSupplier valid

    @Override
    Object handle(Request request, Response response) throws Exception {
        if (valid && !valid.getAsBoolean()) {
            response.status(500)
            return ''
        }

        return this.route.handle(request, response)
    }
}