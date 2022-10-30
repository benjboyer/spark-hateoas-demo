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

  <slide :fullwidth="false" #body>
    <div class="card">
      <div class="card-content">
        <div class="media is-align-items-center mb-0">
          <div class="media-left">
          <figure class="image is-256x256">
          <img src="benjamin.jpg" alt="Placeholder image">
        </figure>
          </div>
          <div class="media-content">
            <p class="title is-4 has-text-black">Benjamin Boyer</p>
            <p class="subtitle is-6 has-text-black">
              @benjboyer
              <a target="_blank" href="https://github.com/benjboyer"><b-icon icon="github" /></a>
              <a target="_blank"  href="https://www.linkedin.com/in/benjamin-boyer-a18b54a1/"><b-icon icon="linkedin" /></a></p>
          </div>
        </div>

        <div class="content is-medium">
          <p class="title is-5 has-text-black">parlons que de moi :</p>
          <ul>
            <li>Découvert la programmation à l'aube de l'adolescence, parce que construire des instruments de musique est plus difficile</li>
            <li>Plus de <strong>10 années d'expériences</strong> sur la marché</li>
            <li>Déjà eut une (jeune) compagnie de live streaming, tout en étant employé, pendant des rénovations majeures</li>
            <li>Converti et automatisé le CI/CD de 100+ applications Java... dans une équipe <strong>dotNet</strong></li>
            <li>Multiplie les projets <strong>open-source</strong> qui ne se terminent pas</li>
            <li>Développe actuellement un nouveau produit, mieux que <strong class="has-text-danger">Jira<b-icon icon="skull" /></strong> (<span class="has-text-strikethrough">agile board</span> tracking board), faire évoluer les idées par les experts</li>
            <li>Maintenant coach/tech. lead. au service des équipes qui aiment bien mélanger productivité, créativité et folie</li>
          </ul>
        </div>
      </div>
    </div>
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
    <pre class="is-3"><code class="language-json">
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
</code></pre>
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
      Les atouts importants du HATEOAS sont
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
      Comme toute chose, il y a des prérequis, il faut surtout
    </p>
    <p class="subtitle is-3">
      <ul>
        <li>Designer les différents chemins pour les différents cas d'utilisation</li>
      </ul>
    </p>
    <p class="subtitle is-3">
      <strong>IMPORTANT:</strong> HATEOAS n'est pas une techno, c'est une architecture.
    </p>
  </slide>

  <slide #body>
    <p class="title is-1 is-spaced">
      Une ressource HATEOAS-compatible contient une liste de ressources qui contiennent chacun 3 éléments
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