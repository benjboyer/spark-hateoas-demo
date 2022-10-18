Vue.component('slide', {
  template: `
<b-carousel-item>
  <section class="hero is-fullheight" :class="color">
    <div class="hero-body">
      <div class="content is-fullwidth">
        <slot name="body" />
      </div>
    </div>
  </section>
</b-carousel-item>
`,
  data() {
    return {
      colors: ['is-info', 'is-success', 'is-primary', 'is-link', 'is-dark']
    }
  },
  computed: {
    color() {
      return this.colors[Math.floor(Math.random() * (this.colors.length - 0.1))]
    }
  }

})