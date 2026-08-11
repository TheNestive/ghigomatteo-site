import type { Locale } from "@/i18n/config";

/* ------------------------------------------------------------------ *
 * Dictionnaire i18n : TOUTES les chaînes visibles de l'interface, par
 * zone. FR = versions verbatim des composants ; EN = traductions
 * professionnelles. `getDict(locale)` renvoie le bon jeu.
 *
 * Les paragraphes contenant du gras/couleur inline sont stockés en
 * HTML (rendus via dangerouslySetInnerHTML) pour préserver le rendu
 * FR à l'identique.
 * ------------------------------------------------------------------ */

const fr = {
  header: {
    navTravail: "Travail",
    navDrone: "Drone",
    navMethode: "Méthode",
    navLastwork: "Dernier projet",
    navContact: "Contact",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    close: "Fermer",
  },

  footer: {
    trusted: "Ils m'ont fait confiance",
    studio: "Studio",
    studioCity: "Paris, France",
    studioRoam: "Itinérance mondiale",
    email: "Email",
    available: "Disponible",
    availableLine1: "France · Europe",
    availableLine2: "Monde entier",
    social: "Réseaux",
    socialSub: "Photo · Drone · Vidéo",
    mapLabel: "Là où j'ai photographié",
    rights: (year: number) => `© ${year} Ghigo Matteo · Tous droits réservés`,
    role: "Photographe · Télépilote drone certifié",
    backToTop: "Retour en haut",
    imageAlt:
      "Mainstage de Tomorrowland en pleine performance, par Ghigo Matteo",
  },

  localeToggle: {
    fr: "FR",
    en: "EN",
    ariaLabel: "Langue",
  },

  home: {
    srHeading: "Ghigo Matteo · Photographe",
    aboutKicker: "Qui suis-je",
    aboutLead:
      "Production photo & drone pour des marques, festivals et agences, en France et à l’international.",
    aboutBody:
      "Photographe et opérateur drone certifié, j’interviens sur des projets exigeant précision, réactivité et direction visuelle structurée. Des images claires, cohérentes, adaptées aux besoins de diffusion des artistes et des marques.",
    howIWork: "Comment je travaille →",
    contactMe: "Me contacter →",
    suiteTitle: "La suite du travail",
    projectsCount: (n: string) => `${n} projets`,
  },

  index: {
    title: "Index · Tous les projets",
    seeMore: (n: number) => `VOIR PLUS · ${n} AUTRES PROJETS ↓`,
    seeLess: "VOIR MOINS ↑",
  },

  common: {
    categories: {
      evenement: "Événement",
      corporate: "Corporate",
      lifestyle: "Lifestyle",
    },
  },

  drone: {
    coverAlt:
      "Vue aérienne au drone d'un festival de nuit, foule immense sous les lumières",
    crumb: "Prises de vue aériennes",
    title: "Drone",
    // gras inline → rendu HTML
    leadHtml:
      "Je suis <strong>télépilote pro certifié</strong> pour l’usage de drones en France et à l’international. Cela me permet de réaliser des prises de vue aériennes en toute <strong>sécurité</strong>, dans le <strong>respect des réglementations</strong> en vigueur, y compris en zones contrôlées et lors d’événements.",
    lead2:
      "Le drone permet de raconter autrement : prendre de la hauteur, dévoiler l’ampleur d’un lieu, d’un public, d’une ambiance ou d’un paysage. C’est une perspective qui donne de l’espace et une nouvelle façon de ressentir la scène.",
    heroAlt: "Vue aérienne au drone",
    servicesTitle: "Mes prestations drone",
    servicesIntro:
      "De la fluidité cinématique à l’intensité du FPV, j’utilise les deux types de drones pour créer des images aériennes qui mêlent précision, énergie et émotion, au service de chaque projet.",
    serviceLabel: "Prestation",
    see: "Voir",
    prestations: [
      {
        title: "Événementiel",
        text: "En événementiel, le drone permet de montrer l’énergie de l’ensemble. Les foules, les mouvements, l’architecture du lieu, l’ampleur de la scène. C’est une manière de raconter ce que l’œil ne peut pas saisir depuis le sol : l’instant dans sa globalité.",
        example: "DJ Snake x Netflix",
      },
      {
        title: "Lieux & Immobilier",
        text: "Pour l’architecture, l’hôtellerie, l’immobilier ou la valorisation d’un espace, le drone met en avant les volumes, les lignes, la relation du lieu avec son environnement. Il permet d’avoir une image claire, structurée, élégante, et surtout compréhensible d’un seul regard.",
        example: "Ibiza estate",
      },
      {
        title: "Nature & Paysages",
        text: "Dans la nature, le drone ouvre la scène. Il révèle ce qui dépasse notre échelle : les textures du terrain, les courbes, les couleurs, le mouvement de l’eau ou du vent. C’est une manière de montrer la beauté d’un lieu sans l’interrompre.",
        example: "Vulcano, en Sicile",
      },
    ],
  },

  travaille: {
    crumb: "Ma méthode",
    title: "Comment je travaille",
    leadHtml:
      "Ma façon de faire dépendra de <span class=\"text-red\">votre projet</span> et de <span class=\"text-red\">notre vision</span> des choses.",
    sig1Html:
      "<strong>Ma signature, c’est le travail en post-production.</strong> J’utilise souvent la double exposition, des superpositions et des textures pour donner une dimension plus profonde à la scène. Ce n’est pas un effet posé par-dessus : c’est ma manière de représenter la mémoire d’un moment, ce qui reste après, ce que l’on ressent encore quand tout est terminé.",
    sig2: "On ne se souvient jamais d’un concert de façon nette. On se souvient d’une ambiance, d’une silhouette, d’une lumière qui traverse la fumée. Une image qui ne documente pas juste l’événement, mais qui en prolonge l’émotion.",
    whoLabel: "01 · Qui suis-je",
    whoBody1:
      "Je suis photographe professionnel de 25 ans, et télépilote de drone certifié. Je travaille en France et à l’international, mon appareil voyage partout avec moi.",
    whoBody2:
      "Que ce soit sur scène, en backstage ou en déplacement, j’accompagne les projets partout dans le monde.",
    portraitAlt: "Portrait de Matteo Ghigo",
    shootLabel: "02 · Pendant le shooting",
    shootBody1Html:
      "Pendant le shoot, je travaille avec du matériel adapté aux scènes rapides et aux lumières changeantes, mais le plus important reste <strong>l’instant</strong>.",
    shootBody2:
      "Je me déplace, j’observe et je déclenche. S’il y a une scène, des artistes, des membres d’équipe, je prends le temps de m’adapter à leur rythme et à leur dynamique.",
    shootAlt: "En studio pendant un shooting",
    editHead: "Avant / Après · Editing",
    editIntroHtml:
      "Je commence par <strong class=\"text-ink\">Lightroom</strong>. C’est là que j’équilibre la lumière, les couleurs, les contrastes, que je donne une base cohérente à la série. Ensuite, je passe sur <strong class=\"text-ink\">Photoshop</strong>. C’est là que mon style s’exprime vraiment.",
    dragToCompare: "Fais glisser pour comparer",
    processHead: "Le processus de création",
    processIntroHtml:
      "J’utilise la double exposition, les superpositions et les textures pour donner de la profondeur à l’image. L’idée n’est pas de «&nbsp;rajouter un effet&nbsp;», mais de retrouver la sensation du moment. Je travaille chaque image une par une, jusqu’à ce qu’elle soit équilibrée, vivante, et qu’elle porte l’émotion de ce qui a été vécu.",
    stepWord: "Étape",
    etapes: [
      "Choix et retouche de la photo 1",
      "Choix et retouche de la photo 2",
      "Détourage et placement des éléments",
      "Compositing et ajout des effets finaux",
    ],
    beforeLabel: "Avant",
    afterLabel: "Après",
    beforeAlt: "Avant retouche",
    afterAlt: "Après retouche",
    deliveryHead: "Fin de projet & Livraison",
    deliveryBody1Html:
      "Une fois les photos prêtes, j’envoie un <strong>lien privé</strong> vers une page dédiée sur mon site. Vous pouvez y visionner toutes les images, faire votre sélection et les télécharger en haute définition, directement.",
    deliveryBody2:
      "La galerie peut être partagée facilement avec votre équipe ou vos partenaires. Tout est centralisé, clair, et disponible quand vous en avez besoin.",
  },

  contact: {
    crumb: "Parlons de votre projet",
    title: "Contact",
    lead: "Si vous avez un projet, une date ou une idée, je suis disponible pour en discuter. Dites-moi ce que vous souhaitez créer, et nous le créerons ensemble.",
    writeMe: (email: string) => `M’écrire à ${email}`,
    formHead: "Ou laissez-moi un message",
    quickReply: "Réponse rapide, promis",
    fieldNom: "Nom",
    fieldEmail: "Email",
    fieldProjet: "Type de projet",
    fieldDate: "Date envisagée",
    fieldMessage: "Message",
    phNom: "Votre nom",
    phEmail: "vous@exemple.com",
    phProjet: "Festival, corporate, drone, shooting…",
    phDate: "Ex. 12 septembre 2026, ou « flexible »",
    phMessage: "Racontez-moi votre projet…",
    send: "Envoyer →",
    formHint: "Le bouton ouvre votre messagerie avec le message pré-rempli.",
    metaCity: "Paris · FR",
    metaAvailable: "Disponible en France et à l’international",
    metaDisciplines: "Photo · Drone · Vidéo",
    mailSubject: (name: string) => `Projet de ${name}`,
    mailNewContact: "nouveau contact",
    mailNom: "Nom",
    mailEmail: "Email",
    mailProjet: "Projet",
    mailDate: "Date envisagée",
  },

  contactCta: {
    kicker: "Contact",
    body: "Si vous avez un projet, une date ou une idée, je suis disponible pour en discuter. Dites-moi ce que vous souhaitez créer, et nous le créerons ensemble.",
    contactMe: "Me contacter →",
    instagram: "Instagram ↗",
  },

  lastwork: {
    crumb: "Mon dernier projet",
    dateLabel: "Date",
    placeLabel: "Lieu",
    imagesLabel: "Images",
    previewHead: "Aperçu du projet",
    imagesTotal: (n: string) => `${n} images au total`,
    discover: "Découvrir le projet complet →",
  },

  project: {
    backWork: "← Travail",
    projectN: (i: string, total: string) => `Projet ${i} / ${total}`,
    metaDate: "DATE",
    metaPlace: "LIEU",
    metaImages: "IMAGES",
    metaLink: "LIEN",
    tabAll: "Tout",
    tabMosaic: "Mosaïque",
    tabGlobal: "Global",
    imagesCount: (n: string) => `${n} images`,
    ariaSections: "Sections du reportage",
    ariaFormat: "Format d’affichage",
    ariaPrev: "Image précédente",
    ariaNext: "Image suivante",
    ariaViewImage: (n: string) => `Voir l’image ${n}`,
    ariaGallery: (title: string, i: string, total: string) =>
      `Galerie ${title}, image ${i} sur ${total}`,
    nextProject: "Projet suivant",
    videoComing: "Vidéo à venir",
    sectionLabels: {
      "Activations partenaires": "Activations partenaires",
      "Les scènes": "Les scènes",
      "Les artistes": "Les artistes",
      "Les festivaliers": "Les festivaliers",
      "L’atmosphère": "L’atmosphère",
      "Exemple de set": "Exemple de set",
    } as Record<string, string>,
    sectionTexts: {
      "Activations partenaires":
        "Les espaces de marque et dispositifs partenaires : stands, installations et expériences immersives pensés pour prolonger le festival au-delà des scènes.",
      "Les scènes":
        "Architecture, lumière et pyrotechnie : les scènes photographiées comme des décors de cinéma, du lever de rideau au bouquet final.",
      "Les artistes":
        "Les artistes en pleine performance, saisis au plus près de l’énergie de la cabine et du lien avec la foule.",
      "Les festivaliers":
        "Le public, cœur du festival : regards, tenues et instants de communion sur les pistes enneigées de l’Alpe d’Huez.",
      "L’atmosphère":
        "La direction artistique et l’ambiance montagne : neige, brume, néons et détails qui composent l’identité visuelle de l’événement.",
      "Exemple de set":
        "Un set complet couvert de bout en bout, une sélection resserrée qui montre le rythme d’un B2B, de la montée à l’apogée.",
    } as Record<string, string>,
  },

  transition: {
    labels: {
      "/": "Accueil",
      "/drone": "Drone",
      "/travaille": "Méthode",
      "/lastwork": "Dernier projet",
      "/contact": "Contact",
    } as Record<string, string>,
  },

  meta: {
    home: {
      title: "Ghigo Matteo · Photographe événementiel, corporate & drone",
      description:
        "Matteo Ghigo, photographe et télépilote drone basé à Paris. Production photo et vidéo pour festivals, artistes, marques et agences, en France et à l'international.",
    },
    drone: {
      title: "Photographe & télépilote drone certifié",
      description:
        "Prises de vue aériennes par drone pour l'événementiel, l'immobilier et la nature. Télépilote certifié basé à Paris, disponible en France et à l'international.",
    },
    travaille: {
      title: "Ma méthode",
      description:
        "Ma méthode de A à Z : shooting, editing Lightroom et Photoshop, double exposition signature, stories réseaux et livraison en galerie privée haute définition.",
    },
    contact: {
      title: "Contact",
      description:
        "Un projet, une date, une idée ? Contactez Matteo Ghigo, photographe événementiel, corporate et lifestyle à Paris, disponible partout en France et à l'international.",
    },
    lastwork: {
      title: "Dernier projet",
      description:
        "Mon dernier projet : Tomorrowland Winter 2026 à l'Alpe d'Huez. Scènes, artistes, festivaliers et activations de marque, entre montagne et musique.",
    },
  },
};

type Dict = typeof fr;

const en: Dict = {
  header: {
    navTravail: "Work",
    navDrone: "Drone",
    navMethode: "Method",
    navLastwork: "Latest project",
    navContact: "Contact",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    close: "Close",
  },

  footer: {
    trusted: "Trusted by",
    studio: "Studio",
    studioCity: "Paris, France",
    studioRoam: "Roaming worldwide",
    email: "Email",
    available: "Available",
    availableLine1: "France · Europe",
    availableLine2: "Worldwide",
    social: "Social",
    socialSub: "Photo · Drone · Video",
    mapLabel: "Where I’ve photographed",
    rights: (year: number) => `© ${year} Ghigo Matteo · All rights reserved`,
    role: "Photographer · Certified drone pilot",
    backToTop: "Back to top",
    imageAlt: "Tomorrowland mainstage mid-performance, by Ghigo Matteo",
  },

  localeToggle: {
    fr: "FR",
    en: "EN",
    ariaLabel: "Language",
  },

  home: {
    srHeading: "Ghigo Matteo · Photographer",
    aboutKicker: "About",
    aboutLead:
      "Photo & drone production for brands, festivals and agencies, in France and worldwide.",
    aboutBody:
      "A certified photographer and drone operator, I work on projects that demand precision, responsiveness and structured visual direction. Clear, consistent images tailored to the distribution needs of artists and brands.",
    howIWork: "How I work →",
    contactMe: "Get in touch →",
    suiteTitle: "More of the work",
    projectsCount: (n: string) => `${n} projects`,
  },

  index: {
    title: "Index · All projects",
    seeMore: (n: number) => `SEE MORE · ${n} MORE PROJECTS ↓`,
    seeLess: "SEE LESS ↑",
  },

  common: {
    categories: {
      evenement: "Event",
      corporate: "Corporate",
      lifestyle: "Lifestyle",
    },
  },

  drone: {
    coverAlt:
      "Aerial drone view of a festival at night, a huge crowd under the lights",
    crumb: "Aerial photography",
    title: "Drone",
    leadHtml:
      "I’m a <strong>certified professional drone pilot</strong> for operating drones in France and abroad. This lets me carry out aerial shots in complete <strong>safety</strong>, in <strong>full compliance with the regulations</strong> in force, including in controlled zones and during events.",
    lead2:
      "The drone offers another way to tell a story: rising above, revealing the scale of a place, a crowd, a mood or a landscape. It’s a perspective that gives space and a new way to feel the scene.",
    heroAlt: "Aerial drone view",
    servicesTitle: "My drone services",
    servicesIntro:
      "From cinematic smoothness to the intensity of FPV, I use both types of drone to create aerial images that blend precision, energy and emotion, in the service of every project.",
    serviceLabel: "Service",
    see: "See",
    prestations: [
      {
        title: "Events",
        text: "At events, the drone reveals the energy of the whole. The crowds, the movement, the architecture of the venue, the scale of the stage. It’s a way of telling what the eye cannot grasp from the ground: the moment in its entirety.",
        example: "DJ Snake x Netflix",
      },
      {
        title: "Places & Real estate",
        text: "For architecture, hospitality, real estate or showcasing a space, the drone brings out the volumes, the lines and the way a place relates to its surroundings. It delivers a clear, structured, elegant image that is instantly readable.",
        example: "Ibiza estate",
      },
      {
        title: "Nature & Landscapes",
        text: "In nature, the drone opens up the scene. It reveals what goes beyond our scale: the textures of the terrain, the curves, the colours, the movement of water or wind. It’s a way of showing the beauty of a place without interrupting it.",
        example: "Vulcano, Sicily",
      },
    ],
  },

  travaille: {
    crumb: "My method",
    title: "How I work",
    leadHtml:
      "The way I work will depend on <span class=\"text-red\">your project</span> and on <span class=\"text-red\">our shared vision</span>.",
    sig1Html:
      "<strong>My signature is the post-production work.</strong> I often use double exposure, overlays and textures to give the scene a deeper dimension. It’s not an effect laid on top: it’s my way of representing the memory of a moment, what remains afterwards, what you still feel once it’s all over.",
    sig2: "You never remember a concert sharply. You remember a mood, a silhouette, a light cutting through the smoke. An image that doesn’t just document the event, but prolongs its emotion.",
    whoLabel: "01 · About me",
    whoBody1:
      "I’m a 25-year-old professional photographer and a certified drone pilot. I work in France and internationally, my camera travels everywhere with me.",
    whoBody2:
      "Whether on stage, backstage or on the road, I support projects all over the world.",
    portraitAlt: "Portrait of Matteo Ghigo",
    shootLabel: "02 · During the shoot",
    shootBody1Html:
      "During the shoot, I work with gear suited to fast-moving scenes and shifting light, but what matters most is still <strong>the moment</strong>.",
    shootBody2:
      "I move around, observe and shoot. If there’s a stage, artists or crew members, I take the time to adapt to their pace and their dynamic.",
    shootAlt: "In the studio during a shoot",
    editHead: "Before / After · Editing",
    editIntroHtml:
      "I start with <strong class=\"text-ink\">Lightroom</strong>. That’s where I balance the light, the colours and the contrast, and set a consistent base for the series. Then I move to <strong class=\"text-ink\">Photoshop</strong>. That’s where my style really comes through.",
    dragToCompare: "Drag to compare",
    processHead: "The creative process",
    processIntroHtml:
      "I use double exposure, overlays and textures to give the image depth. The idea isn’t to «&nbsp;add an effect&nbsp;», but to recover the feeling of the moment. I work each image one by one, until it’s balanced, alive, and carries the emotion of what was experienced.",
    stepWord: "Step",
    etapes: [
      "Selecting and editing photo 1",
      "Selecting and editing photo 2",
      "Cutting out and placing the elements",
      "Compositing and adding the final effects",
    ],
    beforeLabel: "Before",
    afterLabel: "After",
    beforeAlt: "Before editing",
    afterAlt: "After editing",
    deliveryHead: "Project wrap & Delivery",
    deliveryBody1Html:
      "Once the photos are ready, I send a <strong>private link</strong> to a dedicated page on my site. You can view all the images there, make your selection and download them in high definition, directly.",
    deliveryBody2:
      "The gallery can be shared easily with your team or your partners. Everything is centralised, clear, and available whenever you need it.",
  },

  contact: {
    crumb: "Let’s talk about your project",
    title: "Contact",
    lead: "If you have a project, a date or an idea, I’m available to talk it through. Tell me what you want to create, and we’ll create it together.",
    writeMe: (email: string) => `Email me at ${email}`,
    formHead: "Or leave me a message",
    quickReply: "Quick reply, promise",
    fieldNom: "Name",
    fieldEmail: "Email",
    fieldProjet: "Project type",
    fieldDate: "Preferred date",
    fieldMessage: "Message",
    phNom: "Your name",
    phEmail: "you@example.com",
    phProjet: "Festival, corporate, drone, shoot…",
    phDate: "e.g. 12 September 2026, or “flexible”",
    phMessage: "Tell me about your project…",
    send: "Send →",
    formHint: "The button opens your email app with the message pre-filled.",
    metaCity: "Paris · FR",
    metaAvailable: "Available in France and worldwide",
    metaDisciplines: "Photo · Drone · Video",
    mailSubject: (name: string) => `Project from ${name}`,
    mailNewContact: "new contact",
    mailNom: "Name",
    mailEmail: "Email",
    mailProjet: "Project",
    mailDate: "Preferred date",
  },

  contactCta: {
    kicker: "Contact",
    body: "If you have a project, a date or an idea, I’m available to talk it through. Tell me what you want to create, and we’ll create it together.",
    contactMe: "Get in touch →",
    instagram: "Instagram ↗",
  },

  lastwork: {
    crumb: "My latest project",
    dateLabel: "Date",
    placeLabel: "Location",
    imagesLabel: "Images",
    previewHead: "Project preview",
    imagesTotal: (n: string) => `${n} images total`,
    discover: "Explore the full project →",
  },

  project: {
    backWork: "← Work",
    projectN: (i: string, total: string) => `Project ${i} / ${total}`,
    metaDate: "DATE",
    metaPlace: "LOCATION",
    metaImages: "IMAGES",
    metaLink: "LINK",
    tabAll: "All",
    tabMosaic: "Mosaic",
    tabGlobal: "Global",
    imagesCount: (n: string) => `${n} images`,
    ariaSections: "Reportage sections",
    ariaFormat: "Display format",
    ariaPrev: "Previous image",
    ariaNext: "Next image",
    ariaViewImage: (n: string) => `View image ${n}`,
    ariaGallery: (title: string, i: string, total: string) =>
      `Gallery ${title}, image ${i} of ${total}`,
    nextProject: "Next project",
    videoComing: "Video coming soon",
    sectionLabels: {
      "Activations partenaires": "Partner activations",
      "Les scènes": "The stages",
      "Les artistes": "The artists",
      "Les festivaliers": "The festival-goers",
      "L’atmosphère": "The atmosphere",
      "Exemple de set": "Sample set",
    } as Record<string, string>,
    sectionTexts: {
      "Activations partenaires":
        "Brand spaces and partner setups: stands, installations and immersive experiences designed to extend the festival beyond the stages.",
      "Les scènes":
        "Architecture, light and pyrotechnics: the stages photographed like film sets, from curtain-up to the grand finale.",
      "Les artistes":
        "The artists mid-performance, caught as close as possible to the energy of the booth and their bond with the crowd.",
      "Les festivaliers":
        "The crowd, heart of the festival: faces, outfits and moments of communion on the snowy slopes of Alpe d’Huez.",
      "L’atmosphère":
        "The art direction and mountain mood: snow, mist, neon and the details that shape the event’s visual identity.",
      "Exemple de set":
        "A full set covered from start to finish, a tight selection showing the rhythm of a B2B, from the build-up to the peak.",
    } as Record<string, string>,
  },

  transition: {
    labels: {
      "/": "Home",
      "/drone": "Drone",
      "/travaille": "Method",
      "/lastwork": "Latest project",
      "/contact": "Contact",
    } as Record<string, string>,
  },

  meta: {
    home: {
      title: "Ghigo Matteo · Event, corporate & drone photographer",
      description:
        "Matteo Ghigo, photographer and licensed drone pilot based in Paris. Photo and video production for festivals, artists, brands and agencies, in France and worldwide.",
    },
    drone: {
      title: "Photographer & certified drone pilot",
      description:
        "Aerial drone photography for events, real estate and nature. Certified drone pilot based in Paris, available in France and worldwide.",
    },
    travaille: {
      title: "My method",
      description:
        "My method from A to Z: shooting, Lightroom and Photoshop editing, signature double exposure, social stories and delivery in a private high-definition gallery.",
    },
    contact: {
      title: "Contact",
      description:
        "A project, a date, an idea? Get in touch with Matteo Ghigo, event, corporate and lifestyle photographer in Paris, available across France and worldwide.",
    },
    lastwork: {
      title: "Latest project",
      description:
        "My latest project: Tomorrowland Winter 2026 at Alpe d’Huez. Stages, artists, festival-goers and brand activations, between mountains and music.",
    },
  },
};

export const dict: Record<Locale, Dict> = { fr, en };

export function getDict(locale: Locale): Dict {
  return dict[locale] ?? dict.fr;
}
