/**
 * Core profile data — bilingual fields live together (`es`/`en`).
 * Every value here has a traceable source row in docs/content-sources.md.
 */

export interface Bilingual {
  es: string;
  en: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  tagline: Bilingual;
  location: Bilingual;
  /** Toggle this flag to reflect current freelance/role availability. */
  available: boolean;
  email: string;
  links: {
    github: SocialLink;
    linkedin: SocialLink;
  };
  /** Medellín, Colombia — used by the home globe and the about-page portrait composition. */
  coordinates: {
    lat: number;
    lon: number;
    latLabel: string;
    lonLabel: string;
  };
  /**
   * About-page professional summary, one entry per paragraph. Composed from
   * facts already traceable in src/data/experience.ts and this file's own
   * tagline (current GBM role, EIA background, FiniaERP/NextEraTech) — see
   * docs/content-sources.md § Sobre mí — bio.
   */
  bio: Bilingual[];
  /**
   * Optional real photo for the About-page portrait slot. Leave undefined
   * to render the default CSS/SVG graphic composition (dotted-grid/orbital
   * pattern with Medellín coordinates) in src/components/PortraitComposition.astro.
   * Set to a path under public/ (e.g. '/portrait.jpg') to swap in a real photo.
   */
  photoUrl?: string;
}

export const profile: Profile = {
  name: 'Jhonier Negrete',
  tagline: {
    es: 'AI Transformation Lead | Agentes de IA Empresariales y Gobernanza',
    en: 'AI Transformation Lead | Enterprise AI Agents & Governance',
  },
  location: {
    es: 'Medellín, Colombia',
    en: 'Medellín, Colombia',
  },
  available: true,
  email: 'contacto@jnegrete.dev',
  links: {
    github: {
      label: 'github.com/JhonierNegrete10',
      url: 'https://github.com/JhonierNegrete10',
    },
    linkedin: {
      label: 'linkedin.com/in/jhonier-negrete',
      url: 'https://www.linkedin.com/in/jhonier-negrete',
    },
  },
  coordinates: {
    lat: 6.2442,
    lon: -75.5812,
    latLabel: 'LAT 6.2442° N',
    lonLabel: 'LON 75.5812° W',
  },
  bio: [
    {
      es: 'Soy Jhonier Negrete, AI Engineer en GBM Colombia desde mayo de 2024. Diseño e implemento topologías de agentes con LangChain y LangGraph, gobierno el acceso a modelos con Bifrost/LiteLLM y sostengo evaluación continua con Langfuse y Phoenix — llevar la IA de un prototipo a un sistema que opera todos los días.',
      en: "I'm Jhonier Negrete, an AI Engineer at GBM Colombia since May 2024. I design and implement agent topologies with LangChain and LangGraph, govern model access with Bifrost/LiteLLM, and run continuous evaluation with Langfuse and Phoenix — taking AI from a prototype to a system that operates every day.",
    },
    {
      es: 'Mi base es la Ingeniería Mecatrónica (EIA, 2017–2022) y la Especialización en Inteligencia Artificial (EIA, 2024), donde construí TTSFlow como trabajo de grado. En paralelo a mi rol en GBM, fundé FiniaERP y NextEraTech, dos productos propios en construcción.',
      en: 'My base is a Mechatronics Engineering degree (EIA, 2017–2022) and an AI Specialization (EIA, 2024), where I built TTSFlow as my capstone. Alongside my role at GBM, I founded FiniaERP and NextEraTech, two of my own products in progress.',
    },
  ],
  // photoUrl is left unset on purpose — the About page falls back to the
  // graphic composition. Set e.g. photoUrl: '/portrait.jpg' to swap in a
  // real photo dropped into public/.
  photoUrl: undefined,
};
