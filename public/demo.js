Vue.component('demo', {
  template: `
<b-carousel :autoplay="false">

  <slide #body>
    <p class="subtitle is-3">Les technos utilisées:</p>
    <ul class="is-size-4">
      <li><a target="_blank" href="https://buefy.org/">Buefy (Bulma)</a></li>
      <li><a target="_blank" href="https://vuejs.org/">VueJS</a></li>
      <li><a target="_blank" href="https://sparkjava.com/">Spark</a></li>
      <li><a target="_blank" href="https://groovy-lang.org/">Groovy</a></li>
    </ul>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Pour la partie serveur... (Spark & Groovy)
    </p>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    On index chaque <i>route</i> pour déterminer la <strong class="is-underlined">rel</strong>ation
    </p>
    <pre class="is-3"><code class="language-java">// UserController.groovy
get('/whoami', new RelRoute(name: 'getWhoAmI', route: (req, res) -> {
    JsonOutput.toJson(getCurrentUser() + getCurrentUserLinks())
}))
</code></pre>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    La logique pour déterminer un <i>hypermedia</i> <strong class="is-underlined">doit être</strong> la même pour valider l'accès à la <i>route</i>
    </p>
    <pre class="is-3"><code class="language-java">// RelRoute.groovy
class RelRoute implements Route {
  ...
  Object handle(Request request, Response response) throws Exception {
      if (valid && !valid.getAsBoolean()) {
          response.status(500)
          return ''
      }
      ...
  }
}
// UserController.groovy
get('/secured', new RelRoute(
        name: 'secured',
        valid: () -> this.current.admin,
        route: (req, res) -> {
    ...
}))
...
if (HATEOASRoute.get('secured').rel.valid.getAsBoolean()) {
    dto.links.add(HATEOASRoute.get('secured').toLink())
}
</code></pre>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    On interroge <i>Spark</i> pour faciliter la génération des <i>hypermedia</i>
    </p>
    <pre class="is-3"><code class="language-java">// HATEOASRoute.groovy
static void refresh() {
    relRoutes = routes().stream()
      .filter(r -> ((RouteImpl)r.getTarget()).delegate() instanceof RelRoute)
      .map(r -> new HATEOASRoute(r, (RelRoute)((RouteImpl)r.getTarget()).delegate()))
      .collect(Collectors.toMap(HATEOASRoute::getIndex, Function.identity()))
}
...
Map toLink() {
  [href:  this.href, rel: this.index, type: this.match.httpMethod.toString().toUpperCase()]
}
</code></pre>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Pour la partie client... (VueJS & Buefy)
    </p>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    On fait une requête sur la <i>route</i> par défaut ('/api/v1/') pour obtenir les <i>hypermedias</i> racines
    </p>
    <pre class="is-3"><code class="language-javascript">// demo.js
async mounted() {
  const apiJSON = await fetch('/api/v1')
  this.api = await apiJSON.json()

  this.fetchWhoAmI()
}
</code></pre>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    On détermine si <i>l'hypermedia</i> est disponible
    </p>
    <pre class="is-3"><code class="language-javascript">// demo.js
isLinkAvailable(rel) {
  if (!this.api) {
    return false
  }

  return _.filter(this.api?.links, { rel })[0]
}
</code></pre>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
    Pour faciliter, on généralise une méthode qui interpole les informations pour construire la requête physique au serveur
    </p>
    <pre class="is-3"><code class="language-javascript">// demo.js
async callLink(rel, queryParams, data) {
  const link = this.isLinkAvailable(rel)
  if (!link) {
    alert(rel + ' is not available')
    return
  }

  const href = this.interpolate(link.href, queryParams)
  switch (link.type) {
    case 'GET': return await fetch(href)
    // case 'POST' ...
    default: return null
  }
}
</code></pre>
  </slide>

  <slide #body>

    <p class="title is-3 is-spaced">
      Finalement, la démo...
    </p>

    <p>Utilisateur courant: <strong>{{ api?.whoami?.name }}</strong></p>
    <p>... a-t-il accès à la ressource 'secured' ? <strong>
      <span v-if="isLinkAvailable('secured')">Oui</span>
      <span class="has-text-danger" v-else>Non</span>
    </strong></p>

    <b-field grouped multiline>
      <p class="control">
        <b-button @click="changeWhoAmI('ben')">Changer pour 'Ben'</b-button>
      </p>
      <p class="control">
        <b-button @click="changeWhoAmI('xavier')">Changer pour 'Xavier'</b-button>
      </p>
      <p class="control">
        <b-button @click="secured()">Obtenir 'secured'</b-button>
      </p>
      <p class="control">
        <a class="button" target="_blank" href="api/v1/secured">Nouvel onglet 'secured'</a>
      </p>
    </b-field>
      
    <p class="is-size-6">État de la navigation: 
      <span class="is-size-7"><pre>{{api}}</pre></span>
    </p>
    
  </slide>
</b-carousel>

`,
  data() {
    return {
      api: null
    }
  },
  methods: {
    async fetchWhoAmI() {
      const whoamiJSON = await this.callLink('getWhoAmI')
      this.api = await whoamiJSON.json()
    },
    async changeWhoAmI(name) {
      const whoamiJSON = await this.callLink('changeWhoAmI', { name })
      this.api = await whoamiJSON.json()
    },
    async secured() {
      const secured = await this.callLink('secured', { name })
      if (secured) {
        alert(await secured.text())
      }
    },

    async callLink(rel, queryParams, data) {
      const link = this.isLinkAvailable(rel)
      if (!link) {
        alert(`${rel} is not available`)
        return
      }

      const href = this.interpolate(link.href, queryParams)
      switch (link.type) {
        case 'GET': return await fetch(href)
        // case 'POST' ...
        default: return null
      }
    },
    isLinkAvailable(rel) {
      if (!this.api) {
        return false
      }

      return _.filter(this.api?.links, { rel })[0]
    },
    interpolate(str, args) {
      if (!args) {
        return str
      }

      return str.replace(/\${(\w+)}/g, (_, v) => args[v])
    }
  },
  async mounted() {
    const apiJSON = await fetch('/api/v1')
    this.api = await apiJSON.json()

    this.fetchWhoAmI()
  }
})