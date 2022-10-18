Vue.component('demo', {
  template: `
<b-carousel :autoplay="false">

  <slide #body>
    <p class="subtitle is-3">Les technos utilisées:</p>
    <ul class="is-size-4">
      <li><a target="_blank" href="https://buefy.org/">Buefy</a></li>
      <li><a target="_blank" href="https://vuejs.org/">VueJS</a></li>
      <li><a target="_blank" href="https://sparkjava.com/">Spark</a></li>
      <li><a target="_blank" href="https://groovy-lang.org/">Groovy</a></li>
    </ul>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Pour la partie serveur... (Spark & Groovy)
    </p>
    <p class="subtitle is-3">
      Les concepts clés: 
      <ul class="is-size-4">
        <li>On index chaque <i>route</i> pour déterminer la <strong class="is-underlined">rel</strong>ation</li>
        <li>La logique pour déterminer un <i>hypermedia</i> <strong class="is-underlined">doit être</strong> la même pour valider l'accès à la <i>route</i></li>
      </ul>
    </p>
  </slide>

  <slide #body>
    <p>Current user: {{ api?.whoami?.name }}</p>
    <b-button @click="changeWhoAmI('ben')">Change to 'Ben'</b-button>
    <b-button @click="changeWhoAmI('xavier')">Change to 'Xavier'</b-button>
    <p>Can I see the secured resource ? {{ isLinkAvailable('secured') ? 'Yep' : 'Nope' }}</p>
    <p>Let's take a little look at the secured resource... <b-button @click="secured()">just a little look...</b-button> ... but we are smart guys <a target="_blank" href="api/v1/secured">... are we ?</a></p>
    <p class="is-size-7">Current API: <pre>{{api}}</pre></p>
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
    interpolate(str, args) {
      if (!args) {
        return str
      }

      return str.replace(/\${(\w+)}/g, (_, v) => args[v])
    },
    isLinkAvailable(rel) {
      if (!this.api) {
        return false
      }

      return _.filter(this.api?.links, { rel })[0]
    }
  },
  async mounted() {
    const apiJSON = await fetch('/api/v1')
    this.api = await apiJSON.json()

    this.fetchWhoAmI()
  }
})