Vue.component('slides', {
  template: `
<b-carousel :autoplay="false" @change="isCarouselDone" ref="carousel">

  <slide #body>
    <p class="title is-1 is-spaced">
      HATEOAS
    </p>
    <p class="subtitle is-3">
      L'architecture REST des liens <i>hypermedia</i>
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Définition
    </p>
    <p class="subtitle is-3">
      <strong>HATEOAS (Hypermedia as the Engine of Application State)</strong> is a constraint of the REST
      application architecture. HATEOAS keeps the REST style architecture unique from most other network application
      architectures.
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Un exemple
    </p>
    <pre class="is-3 has-background-dark has-text-grey-lighter">
  {
    "departmentId": 10,
    "departmentName": "Administration",
    "locationId": 1700,
    "managerId": 200,
    "links": [
      {
          "href": "10/employees",
          "rel": "employees",
          "type" : "GET"
      }
    ]
  }
    </pre>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      ... Mais pourquoi parler de HATEOAS ?
    </p>
  </slide>

  <slide #body>
    <p class="title is-3 is-spaced">
      C'est une architecture qui permet à l'utilisateur de naviguer dynamiquement aux ressources appropriées
    </p>
    <p class="subtitle is-1">
      ... de façon <strong>sécuritaire</strong>
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Les atouts important du HATEOAS sont
    </p>
    <p class="subtitle is-3">
      <ul>
        <li>Donner des indications à l'utilisateur sur ce qu'il peut ou ne peut pas faire</li>
        <li>Centraliser les règles à un seul endroit (serveur)</li>
        <li>Limiter les indices au client sur son rôle (p.e "est-ce un admin?, ... un éditeur, etc.)</li>
        <li>Designer du code réutilisable autant client que serveur</li>
      </ul>
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Comme toute chose, il y a des prérequis, il faut
    </p>
    <p class="subtitle is-3">
      <ul>
        <li>Designer les différents chemins pour les différents cas d'utilisation</li>
        <li>Avoir une techno serveur qui permet de s'interroger elle-même</li>
      </ul>
    </p>
    <p class="subtitle is-3">
      <strong>IMPORTANT:</strong> HATEOAS n'est pas une techno, c'est une architecture.
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Une resource HATEOAS-compatible contient une liste de ressources qui contiennent chacuns 3 éléments
    </p>
    <p class="subtitle is-3">
      <ul>
        <li>Le lien physique (<i>href</i>) de la prochaine ressource</li>
        <li>Le type de relation (<i>rel</i>)</li>
        <li>Le type de requête (<i>type</i>, 'GET', 'POST', etc.)</li>
      </ul>
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
    Pour en apprendre plus
    </p>
    <p class="subtitle is-3">
      <ul>
        <li><a target="_blank" href="https://restfulapi.net/hateoas/">https://restfulapi.net/hateoas/</a></li>
        <li><a target="_blank" href="https://en.wikipedia.org/wiki/HATEOAS">https://en.wikipedia.org/wiki/HATEOAS</a></li>
      </ul>
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      ... Et maintenant
    </p>
    <p class="subtitle is-1">
      DÉMO !
    </p>
  </slide>

</b-carousel>
`,
  methods: {
    isCarouselDone(index) {
      if (this.$refs.carousel.childItems.length - 1 !== index) {
        return
      }

      setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' })
      }, 1500)

    }
  }
})