Vue.component('layout', {
  template: `
<div>
  <p>Current user: {{ api?.whoami?.name }}</p>
  <button @click="changeWhoAmI('ben')">Change to 'Ben'</button>
  <button @click="changeWhoAmI('xavier')">Change to 'Xavier'</button>
  <p>Can I see the secured resource ? {{ isLinkAvailable('secured') ? 'Yep' : 'Nope' }}</p>
  <p>Let's take a little look at the secured resource... <button @click="secured()">just a little look...</button> ... but we are smart guys <a target="_blank" href="api/v1/secured">... are we ?</a></p>
  <p>Current API: <pre>{{api}}</pre></p>
</div>
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