export const filBleuConfig = {
  version: "2.0.0",
  autoStart: true,
  storageKey: "filBleuProgress",
  storageKeyPrefix: "filBleuProgress:",
  tooltipSeenKey: "filBleuTooltipSeen",
  minDelayBetweenStepsMs: 800,
}

export const filBleuGuides = {
  common: [
    {
      id: "filbleu-essence",
      title: "Pourquoi ce guide ?",
      text: "Le Fil Bleu rassemble les gestes essentiels pour voyager dans Réso•°. Ouvre la modale à tout moment pour retrouver les repères clés.",
    },
    {
      id: "filbleu-usage",
      title: "Comment s’en servir ?",
      text: "Feuillette les cartes, étape par étape. Chaque page ajoute des indications propres à son interface. Tu peux revenir en arrière ou recommencer quand tu veux.",
    },
    {
      id: "filbleu-support",
      title: "Besoin d’un rappel rapide ?",
      text: "Le bouton scintillant en bas à droite reste accessible sur tout le parcours. Il contient aussi des liens utiles lorsque disponibles.",
    },
  ],
  pages: {
    home: {
      title: "Accueil du Réso•°",
      summary: "Comprendre comment lancer ton exploration onirique.",
      steps: [
        {
          id: "home-parcours",
          title: "Choisir ton horizon",
          text: "Utilise « Démarrer » pour aller vers la sélection de mission. Le Fil Bleu te proposera ensuite des repères adaptés.",
        },
        {
          id: "home-compte",
          title: "Créer ou retrouver ton compte",
          text: "Les boutons « Se connecter » et « S’inscrire » ouvrent les portails Supabase sécurisés. Tu peux revenir ici via le menu du bas.",
        },
      ],
    },
    "mission-select": {
      title: "Sélection d’horizons",
      summary: "Choisir ton terrain d’exploration onirique.",
      steps: [
        {
          id: "mission-focus",
          title: "Explorer les missions",
          text: "Chaque carte décrit une culture onirique. Clique pour en savoir plus puis confirme pour entrer dans le voyage.",
        },
        {
          id: "mission-inuite",
          title: "Déclencher la voie Inuite",
          text: "Pour le prototype, seule la mission Inuite est active. Valide-la pour accéder au parcours Onimoji.",
        },
      ],
    },
    "onimoji-journey": {
      title: "Parcours RÊVduJour",
      summary: "Créer un fragment de rêve accompagné.",
      steps: [
        {
          id: "journey-hublot",
          title: "Créer ton fragment",
          text: "Suis les étapes à gauche : choisir un archétype, modeler ton onimoji, écrire ton intention.",
        },
        {
          id: "journey-respiration",
          title: "Respirer le temps de création",
          text: "Le sablier impose un rythme de 12h entre deux créations. Observe les indications en bas de l’écran.",
        },
        {
          id: "journey-suite",
          title: "Publier et poursuivre",
          text: "Une fois ton fragment validé, tu peux l’envoyer vers la Revothèque pour le retrouver, ou filer vers Réso•°.",
        },
      ],
    },
    revotheque: {
      title: "Revothèque personnelle",
      summary: "Retrouver et revisiter tes rêves déposés.",
      steps: [
        {
          id: "revo-consulte",
          title: "Replonger dans un rêve",
          text: "Sélectionne une carte pour relire ton fragment, le partager ou le re-travailler.",
        },
        {
          id: "revo-filtres",
          title: "Filtrer et organiser",
          text: "Utilise les filtres et la recherche pour classer par gardien, intensité ou date.",
        },
      ],
    },
    echoreso: {
      title: "Réseau ÉchoReso",
      summary: "Observer la mise en résonance collective.",
      steps: [
        {
          id: "echo-hublot",
          title: "Toucher le hublot",
          text: "Le globe réagit à tes gestes : effleure pour éveiller la météo onirique.",
        },
        {
          id: "echo-audio",
          title: "Activer la matière sonore",
          text: "Lance l’audio pour ressentir les pulsations des rêves connectés. Les visualisations se densifient au rythme des sons.",
        },
        {
          id: "echo-reseau",
          title: "Lire les résonances",
          text: "Le graphe affiche comment les fragments se relient. Clique sur un nœud pour voir sa sagesse associée.",
        },
      ],
    },
    profil: {
      title: "Profil voyageur",
      summary: "Suivre tes statistiques oniriques et tes accès.",
      steps: [
        {
          id: "profil-stats",
          title: "Statistiques sécurisées",
          text: "Les jauges reflètent tes rêves, échos et gardiens. Les données proviennent d’une vue Supabase protégée.",
        },
        {
          id: "profil-sablier",
          title: "Gérer le sablier",
          text: "En mode test, tu peux désactiver le cooldown de 12h. En prod, il garantit la respiration du réseau.",
        },
        {
          id: "profil-offrande",
          title: "Activer un voyage payant",
          text: "La zone « Voyage onirique » simule un paiement et te confirme l’activation de l’expérience.",
        },
      ],
    },
    create: {
      title: "DreamStar Creator",
      summary: "Assembler une étoile de rêve plus poussée.",
      steps: [
        {
          id: "create-composition",
          title: "Composer ton étoile",
          text: "Combine visuel, audio et texte pour générer un fragment enrichi. Chaque champ nourrit le moteur onirique.",
        },
        {
          id: "create-sauvegarde",
          title: "Sauvegarder",
          text: "Utilise la sauvegarde locale pour reprendre plus tard ou envoyer vers la Revothèque.",
        },
      ],
    },
    login: {
      title: "Connexion",
      summary: "Accéder à ton espace via Supabase.",
      steps: [
        {
          id: "login-identifiants",
          title: "Identifiants",
          text: "Entre ton email et ton mot de passe. La session se restaure sur ce navigateur.",
        },
        {
          id: "login-retour",
          title: "Retour à l’accueil",
          text: "Une fois connecté, le menu bas te permet de revenir à l’accueil ou d’ouvrir directement Réso•°.",
        },
      ],
    },
    register: {
      title: "Inscription",
      summary: "Créer un compte voyageur.",
      steps: [
        {
          id: "register-email",
          title: "Email et mot de passe",
          text: "Nous utilisons Supabase. Vérifie ta boîte mail si la confirmation est requise.",
        },
        {
          id: "register-suite",
          title: "Suite du parcours",
          text: "Après inscription, tu peux te rendre sur « RÊVduJour » pour créer ton premier fragment.",
        },
      ],
    },
    labo: {
      title: "Labo",
      summary: "Espace expérimental pour l’équipe.",
      steps: [
        {
          id: "labo-experiments",
          title: "Expériences en cours",
          text: "Cette zone accueille des outils prototypes : vérifie les instructions internes avant usage.",
        },
        {
          id: "labo-navigation",
          title: "Navigation",
          text: "Reste attentif aux liens de sortie pour revenir vers les parcours publics.",
        },
      ],
    },
    "labo-login": {
      title: "Connexion labo",
      summary: "Passage sécurisé vers l’espace expérimental.",
      steps: [
        {
          id: "labo-login-credentials",
          title: "Identifiants spécifiques",
          text: "Ce portail attend des accès réservés à l’équipe. Contacte l’administrateur si tu n’en as pas.",
        },
      ],
    },
    "admin-inuite": {
      title: "Administration Inuite",
      summary: "Superviser les missions Inuites.",
      steps: [
        {
          id: "admin-suivi",
          title: "Suivi des missions",
          text: "Consulte l’état des pas et des fragments. Cet écran est réservé à l’équipe de pilotage.",
        },
        {
          id: "admin-actions",
          title: "Actions sensibles",
          text: "Les modifications impactent l’ensemble des voyageurs. Vérifie toujours avant de publier.",
        },
      ],
    },
    test: {
      title: "Tests Supabase",
      summary: "Debug et vérifications techniques.",
      steps: [
        {
          id: "test-sql",
          title: "Requêtes de contrôle",
          text: "Cet écran déclenche des sélections Supabase pour vérifier la connectivité.",
        },
        {
          id: "test-retour",
          title: "Retourner au parcours",
          text: "Utilise le menu bas pour revenir dans un flow utilisateur classique après tes tests.",
        },
      ],
    },
  },
}

// TODO: retirer cette export legacy une fois le nouveau FilBleuHelpCenter intégré.
export const filBleuSteps = []
