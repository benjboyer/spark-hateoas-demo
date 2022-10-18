import groovy.json.JsonOutput
import static spark.Spark.*

/**
 * Handle user routes and logics
 */
class UserController {

    def final users = [
            ben   : [
                    name      : 'Ben',
                    admin: true
            ],
            xavier: [
                    name      : 'Xavier',
                    admin: false
            ]
    ]
    def current = users['ben']

    /**
     * Register Spark routes
     */
    void routes() {
        get('',  new RelRoute(name: 'root', route: (req, res) -> {
            JsonOutput.toJson(getCurrentUserLinks())
        }))

        get('/whoami/:name', new RelRoute(name: 'changeWhoAmI', route: (req, res) -> {
            def newName = req.params(':name')
            this.current = users[newName]
            JsonOutput.toJson(getCurrentUser() + getCurrentUserLinks())
        }))

        get('/whoami', new RelRoute(name: 'getWhoAmI', route: (req, res) -> {
            JsonOutput.toJson(getCurrentUser() + getCurrentUserLinks())
        }))

        get('/secured', new RelRoute(
                name: 'secured',
                valid: () -> this.current.admin,
                route: (req, res) -> {
            return "${this.current.name} a accès"
        }))
    }

    /**
     * Gets the currently active user
     * @return A map representation of a user
     */
    Map getCurrentUser() {
        return [whoami: this.current]
    }

    /**
     * Gets the available links for current user
     * @return A map representation of a links holder
     */
    Map getCurrentUserLinks() {
        def dto = [
                links : [HATEOASRoute.get('getWhoAmI').toLink(), HATEOASRoute.get('changeWhoAmI').toLink()]
        ]

        // See how we are reusing the same validation here and at the route level
        if (HATEOASRoute.get('secured').rel.valid.getAsBoolean()) {
            dto.links.add(HATEOASRoute.get('secured').toLink())
        }

        return dto
    }
}
