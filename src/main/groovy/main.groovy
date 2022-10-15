@GrabConfig(systemClassLoader = true)
@Grab("org.slf4j:slf4j-simple:1.7.21")
@Grab("com.sparkjava:spark-core:2.9.4")
import static spark.Spark.*

port((System.getenv()["PORT"] ?: 8080) as int)

if (System.getenv()["DEBUG"]) {
        String projectDir = System.getProperty("user.dir")
        String staticDir = "/src/main/resources/public"
        staticFiles.externalLocation(projectDir + staticDir)
} else {
        staticFiles.location("/public")
}

path("/api/v1", () -> {
        new UserController().routes()
})

awaitInitialization()
HATEOASRoute.refresh()