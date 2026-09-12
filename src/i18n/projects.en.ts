import type { Project } from "@/data/projects";
import type { Locale } from "@/i18n/config";

/* ------------------------------------------------------------------ *
 * Traductions anglaises des projets (par slug). Les noms propres,
 * artistes et festivals restent inchangés. Seuls `desc`, `date` et
 * `place` (quand il contient du texte traduisible) sont fournis ; les
 * champs absents retombent sur la version française (identique).
 * ------------------------------------------------------------------ */

export interface ProjectEn {
  desc: string;
  date?: string;
  place?: string;
}

export const projectsEn: Record<string, ProjectEn> = {
  tomorrowland: {
    desc: "Tomorrowland: oversized stages, walls of light and a crowd as far as the eye can see. I set out to capture the sheer scale of the production as much as the intensity of the sets.",
    date: "2025",
  },
  "tomorrowland-winter": {
    desc: "I had the chance to shoot Tomorrowland Winter during the 2026 season. Across the stages, the festival-goers, the art direction and the more corporate moments, the goal was to capture all the energy of the event: a one-of-a-kind festival where mountains, music and brand experiences meet.",
    date: "2026 season",
  },
  theodora: {
    desc: "Theodora on stage, her silhouette carved out of a beam of light, feather costume and mic in hand. A magnetic, almost sculptural presence, and one of my favourite shoots of the year.",
    date: "2025",
  },
  garorock: {
    desc: "Garorock 2025 was far more than a shoot. I led the festival’s photo team while covering the event in parallel. A talented crew, seamless organisation and an incredible atmosphere. The kind of experience that stays with you and shows that a festival is as much about the artists as the people who build it.",
    date: "2025 edition",
  },
  kungs: {
    desc: "Kungs alone behind his machines, his silhouette cut out against perfectly symmetrical blue lasers. A minimal, sharp and hypnotic aesthetic.",
    date: "2025",
  },
  "inherent-mike-horn": {
    desc: "For INHERENT x Mike Horn, I covered their seminars at Futuroscope, with speakers including Mike Horn. Moments of sharing and inspiration, driven by an energy geared towards action and discovery.",
    date: "20–23 September 2025",
  },
  riles: {
    desc: "One of my favourite concerts to shoot. On stage, Rilès blends energy, dance, precision and passion. Every frame tells a movement.",
    date: "Garorock 2025",
  },
  damso: {
    desc: "I shot Damso at Garorock in 2025. I produced a dedicated post for the festival, with full editing and detailed retouching to convey his dark, precise and intense atmosphere. An artist who never leaves you indifferent on stage.",
    date: "Garorock 2025",
  },
  touquet: {
    desc: "Le Touquet is where it all really started for me. My very first major festival as a professional photographer. There I shot Martin Garrix, Charlotte de Witte, Mosimann… names I had only seen on posters, suddenly just a few metres away, in the light and in motion.\nI still remember the noise, the crowd breathing as one, the feeling of standing at the centre of a whirlwind without ever losing the frame. It was in that chaos that I found a kind of calm, a sense of certainty.\nThat festival is the moment I understood this wasn’t just a passion: it was my direction.",
    date: "25 & 26 August 2025",
  },
  ibiza: {
    desc: "I worked on high-end real estate projects in Ibiza. Architecture, Mediterranean light, carefully considered details. A setting where every photo becomes an invitation.",
    date: "2024 / 2025",
    place: "Ibiza, Spain",
  },
  "ascendant-vierge": {
    desc: "I had the chance to shoot Ascendant Vierge in Paris. Their world literally opened the doors of techno to me. Visually, their aesthetic is incredibly strong, almost cinematic, which makes every image feel alive and intense. It was a goal I’d had for a long time, and one I reached in 2025.",
    date: "26 & 27 September 2025",
  },
  "delta-festival": {
    desc: "At Delta Festival, I covered the 2024 and 2025 editions: in 2024 with artists such as Gazo, Tiakola and Feder, then in 2025 with SDM, Tayc and more. A stage opening onto the sea, a sun-soaked crowd, and a mix of rap, pop and electro that makes every moment intensely visual.",
    date: "2024 & 2025 editions",
  },
  mykonos: {
    desc: "I had the chance to follow a group of American influencers in Mykonos, between private jet, yacht, exclusive parties and villas perched above the sea. A lifestyle story somewhere between luxury and spontaneity.",
    date: "2024",
    place: "Mykonos, Greece",
  },
  "f1-monza": {
    desc: "We followed Wizards, a crypto figure, to create photo, video and drone content on the legendary Monza circuit in Italy. Speed, machinery, history. A setting where everything feels larger than life.",
    date: "2025",
    place: "Monza, Italy",
  },
  "francis-mercier": {
    desc: "I shot Francis Mercier in 2024 at La Clairière. A night full of groove and warmth, in a setting surrounded by nature. I captured one of my favourite photos there, with all those bubbles.",
    date: "12 July 2024",
  },
  dreamnation: {
    desc: "I worked on Dreamnation in 2025 thanks to Maison Guettapen, a photography collective specialised in electronic events. Industrial atmosphere, raves, lasers, bass you feel deep in your bones. A truly sensory experience.",
    date: "26 & 27 September 2025",
  },
  sdm: {
    desc: "SDM is one of my favourite rappers, so shooting him at Delta had a special flavour. A powerful, personal and intense moment.",
    date: "Delta Festival 2025",
  },
  "j-balvin": {
    desc: "I had the opportunity to shoot J Balvin in 2025, at an important time for me. It was the first time I worked with an international artist of that scale. I chose a colour treatment alternating blue and red to follow his vibrant, highly dynamic, almost futuristic-pop visual world. This shoot marked a milestone for me: the moment you realise you’ve stepped up in your journey.",
    date: "Garorock 2025",
  },
  "i-hate-models": {
    desc: "I shot I Hate Models in 2025 on the CTRL B stage. A dark, metallic, hypnotic intensity. An artist where the image tells as much as the sound.",
    date: "Garorock 2025",
  },
  gazo: {
    desc: "One of the most explosive moments of Delta 2024. Raw energy on stage, a crowd in full fusion, and an intensity that leaves nothing to chance.",
    date: "5 September 2024",
  },
  tiakola: {
    desc: "Tiakola in Marseille in 2024 was tenderness blended with celebration. A strong connection with the crowd, choruses sung in unison.",
    date: "Delta Festival 2024",
  },
  "vladimir-cauchemar": {
    desc: "I put together a best-of of Vlad, because I shot him across so many cities: Bordeaux, Paris, Marseille, Lyon… Always a strong artistic direction and a sharp energy. A fascinating artist to follow.",
    date: "2024 / 2025",
  },
  "abu-dhabi": {
    desc: "I covered a corporate event on the theme “Experience Abu Dhabi”, held in Nice. Major brands and companies tied to that legendary destination were present. Networking, conversations and dinners followed one another on the emblematic rooftop of the Le Victoria hotel.",
    date: "August 2025",
  },
  "major-lazer": {
    desc: "Major Lazer on stage: an explosive show captured amid orange smoke, lasers and raw energy. The video aftermovie is below.",
    date: "2025",
  },
  "dj-snake": {
    desc: "I had the chance to shoot DJ Snake, largely by drone. His team needed photo and video content, and I was able to capture the scale of the show from the sky. A moment suspended in light and crowd. All the more powerful as it was for the presentation set of his tracks made in collaboration with Netflix for the Squid Game series.",
    date: "Garorock 2025",
  },
  tayc: {
    desc: "Tayc is elegance on stage. A gentle yet striking presence, a thoughtful staging, an aura that lends itself perfectly to images.",
    date: "Delta Festival 2025",
  },
  stereoparc: {
    desc: "Stereoparc 2024 in Rochefort, electronic stages at the foot of the Corderie Royale, summer light and saturated nights.",
    date: "19 & 20 July 2024",
  },
  "salon-de-la-patisserie": {
    desc: "I was head of photography for the 2024 Salon de la Pâtisserie. I coordinated the whole team, the stands, the products, the talks. Real work of management, observation and organisation.",
    date: "19–21 June 2024",
  },
  italie: {
    desc: "A personal trip to Italy, purely to explore, photograph and feel. Sometimes creating without a goal is the best way to grow.",
    date: "June 2024",
    place: "Italy",
  },
  "monza-shooting": {
    desc: "A photo shoot on the Monza circuit, focusing on the atmosphere, the lines of the track and the sense of speed.",
    date: "2025",
    place: "Monza, Italy",
  },
  "hello-fresh-ffbb": {
    desc: "HelloFresh x FFBB: a brand activation where cooking meets basketball. I covered the event end to end, from the set design to the workshops, from the guests to the product details, to deliver a consistent series, ready to use across every one of the brand’s channels.",
    date: "2026",
  },
  "kalash-criminel": {
    desc: "Kalash Criminel at Golden Coast. Balaclava, printed jersey and Congolese flag: a raw stage presence that I framed as tightly as possible to keep all the tension of the live show.",
    date: "2026",
  },
  macklemore: {
    desc: "Macklemore at Golden Coast. Columns of flame, broad washes of light and wide, sweeping gestures: a show built for the image, where every track tips the mood of the frame.",
    date: "2026",
  },
  plk: {
    desc: "PLK at Golden Coast. Flame jets, tight beams and plenty of haze: a highly graphic stage design, perfect for working silhouettes and backlight.",
    date: "2026",
  },
};

/**
 * Renvoie le projet avec ses champs textuels localisés. En anglais,
 * `desc`/`date`/`place` sont remplacés quand une traduction existe ;
 * sinon on garde la valeur française. Les autres champs sont intacts.
 */
export function localizeProject(project: Project, locale: Locale): Project {
  if (locale === "fr") return project;
  const t = projectsEn[project.slug];
  if (!t) return project;
  return {
    ...project,
    desc: t.desc ?? project.desc,
    date: t.date ?? project.date,
    place: t.place ?? project.place,
  };
}
