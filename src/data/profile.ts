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
};
