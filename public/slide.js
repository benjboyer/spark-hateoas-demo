Vue.component('slide', {
  template: `
<b-carousel-item>
  <section class="hero is-fullheight" :class="color">
    <div class="hero-body" :class=" { 'is-justify-content-center': !fullwidth } ">
      <div class="content" :class="{ 'is-fullwidth': fullwidth }">
        <slot name="body" />
      </div>
    </div>
  </section>
</b-carousel-item>
`,
  props: {
    fullwidth: {
      type: Boolean,
      default: true
    }
  },
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