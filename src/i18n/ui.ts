import type { Lang } from "./routes";

/**
 * All UI chrome strings (nav, labels, CTAs, empty states) in ES/EN.
 * Ported from the "renderVals()" translation table in
 * reference/Portafolio 5a - Sitio.dc.html — labels only, never the
 * placeholder content (that lives in src/data/ and is 100% real).
 *
 * Never hardcode user-facing text in .astro files — import from here.
 */
export const ui = {
  es: {
    skipToContent: "Saltar al contenido",
    siteName: "JNEGRETE.DEV",

    meta: {
      home: {
        title:
          "AI Transformation Lead | Agentes de IA Empresariales y Gobernanza",
        description:
          "Jhonier Negrete, AI Engineer en Medellín: diseño, construyo y opero agentes de IA, RAG y gobernanza LLM en producción.",
      },
    },

    nav: {
      home: "INDEX",
      projects: "PROYECTOS",
      services: "SERVICIOS",
      about: "SOBRE MÍ",
      blog: "BLOG",
      contact: "CONTACTO",
    },

    topbar: {
      available: "DISPONIBLE",
      fullyBooked: "SIN CUPO",
      location: "MED / REMOTE",
      langToggleLabel: "ES / en",
      langToggleAria: "Cambiar a inglés",
      menuOpenAria: "Abrir menú",
      menuCloseAria: "Cerrar menú",
    },

    home: {
      heroTagline:
        "AI Transformation Lead | Agentes Empresariales y Gobernanza de IA",
      heroCta: "CONTACTO",
      cvButton: "CV.PDF",
      tableCol: { no: "No.", project: "Proyecto", stack: "Stack", year: "Año" },
      servicesTeaserFor: "Para empresas",
      servicesTeaserProducts: "Productos",
    },

    projects: {
      title: "Proyectos",
      countSuffix: "PROYECTOS",
      more: "¿Quieres el detalle técnico de algún proyecto?",
      colRole: "Rol",
      colYear: "Año",
      colStack: "Stack",
      viewRepo: "Repositorio ↗",
      viewSite: "Sitio ↗",
    },

    services: {
      title: "Servicios",
      forCompaniesLabel: "Para empresas",
      ctaBookCall: "AGENDAR LLAMADA",
      stepsLabel: "Cómo trabajamos",
    },

    about: {
      title: "Sobre mí",
      base: "BASE",
      baseValue: "Medellín · Remoto",
      languagesLabel: "IDIOMAS",
      languagesValue: "ES / EN",
      statusLabel: "STATUS",
      trackRecordLabel: "TRAYECTORIA",
      stackLabel: "STACK",
      portraitLabel: "Composición gráfica — coordenadas de Medellín, Colombia",
    },

    blog: {
      title: "Blog",
      countSuffix: "ARTÍCULOS",
      colDate: "Fecha",
      colTitle: "Artículo",
      colTags: "Tags",
      colRead: "Lectura",
      comingSoonTitle: "Próximamente",
      comingSoonBody:
        "Estoy preparando los primeros artículos sobre llevar IA a producción. Vuelve pronto.",
      rss: "RSS ↗",
      backToList: "← Volver al blog",
      publishedOn: "Publicado el",
      updatedOn: "Última actualización",
    },

    contact: {
      kickerAvailable: "DISPONIBLE PARA EMPLEO Y PROYECTOS",
      kickerBooked: "CONTACTO",
      title: "Hablemos",
      note: "Cuéntame tu caso de uso, el estado de tus datos y qué quieres lograr. Respondo en 24–48 h, en español o inglés.",
      linkedin: "LinkedIn ↗",
      github: "GitHub ↗",
      cv: "CV.PDF ↓",
    },

    footer: {
      contact: "CONTACTO",
      linkedin: "LINKEDIN",
      github: "GITHUB",
    },

    notFound: {
      eyebrow: "ERROR 404",
      title: "Página no encontrada",
      body: "La página que buscas no existe o fue movida.",
      backHomeEs: "Volver al inicio (ES)",
      backHomeEn: "Home (EN)",
    },
  },

  en: {
    skipToContent: "Skip to content",
    siteName: "JNEGRETE.DEV",

    meta: {
      home: {
        title: "AI Transformation Lead | Enterprise AI Agents & Governance",
        description:
          "Jhonier Negrete, AI Engineer based in Medellín: I design, build and operate production AI agents, RAG and LLM governance.",
      },
    },

    nav: {
      home: "INDEX",
      projects: "WORK",
      services: "SERVICES",
      about: "ABOUT",
      blog: "BLOG",
      contact: "CONTACT",
    },

    topbar: {
      available: "AVAILABLE",
      fullyBooked: "FULLY BOOKED",
      location: "MED / REMOTE",
      langToggleLabel: "es / EN",
      langToggleAria: "Switch to Spanish",
      menuOpenAria: "Open menu",
      menuCloseAria: "Close menu",
    },

    home: {
      heroTagline: "AI Transformation Lead | Enterprise AI Agents & Governance",
      heroCta: "CONTACT",
      cvButton: "CV.PDF",
      tableCol: { no: "No.", project: "Project", stack: "Stack", year: "Year" },
      servicesTeaserFor: "For companies",
      servicesTeaserProducts: "Products",
    },

    projects: {
      title: "Work",
      countSuffix: "PROJECTS",
      more: "Want the technical deep-dive on any project?",
      colRole: "Role",
      colYear: "Year",
      colStack: "Stack",
      viewRepo: "Repo ↗",
      viewSite: "Site ↗",
    },

    services: {
      title: "Services",
      forCompaniesLabel: "For companies",
      ctaBookCall: "BOOK A CALL",
      stepsLabel: "How we work",
    },

    about: {
      title: "About me",
      base: "BASE",
      baseValue: "Medellín · Remote",
      languagesLabel: "LANGUAGES",
      languagesValue: "ES / EN",
      statusLabel: "STATUS",
      trackRecordLabel: "TRACK RECORD",
      stackLabel: "STACK",
      portraitLabel: "Graphic composition — Medellín, Colombia coordinates",
    },

    blog: {
      title: "Blog",
      countSuffix: "POSTS",
      colDate: "Date",
      colTitle: "Post",
      colTags: "Tags",
      colRead: "Read",
      comingSoonTitle: "Coming soon",
      comingSoonBody:
        "I'm working on the first posts about shipping AI to production. Check back soon.",
      rss: "RSS ↗",
      backToList: "← Back to blog",
      publishedOn: "Published on",
      updatedOn: "Last updated",
    },

    contact: {
      kickerAvailable: "AVAILABLE FOR ROLES & PROJECTS",
      kickerBooked: "CONTACT",
      title: "Let's talk",
      note: "Tell me your use case, the state of your data and what you want to achieve. I reply within 24–48 h, in Spanish or English.",
      linkedin: "LinkedIn ↗",
      github: "GitHub ↗",
      cv: "CV.PDF ↓",
    },

    footer: {
      contact: "CONTACT",
      linkedin: "LINKEDIN",
      github: "GITHUB",
    },

    notFound: {
      eyebrow: "ERROR 404",
      title: "Page not found",
      body: "The page you're looking for doesn't exist or was moved.",
      backHomeEs: "Inicio (ES)",
      backHomeEn: "Back home (EN)",
    },
  },
} as const satisfies Record<Lang, unknown>;

export type UiDictionary = (typeof ui)[Lang];

export function getUi(lang: Lang): UiDictionary {
  return ui[lang];
}

/* =========================================================================
 * Appended by the Home/Projects/Services page agent (tasks 3.3-3.5).
 * A handful of strings needed for the Home hero globe were not present in
 * the dictionary above. Kept as a separate export (not merged into `ui`)
 * so this file's existing object literals stay untouched for the sibling
 * agent also editing it — merge these in at the call site with getUiExtra.
 * ========================================================================= */
export const uiExtra = {
  es: {
    home: {
      /** role="img" aria-label for the canvas globe (task 3.3, accessibility). */
      globeAriaLabel: "Globo terrestre animado, centrado en Medellín, Colombia",
      /** Technical readout label over the globe — same string in both locales in the reference design. */
      satLabel: "SAT — LINK ACTIVE",
    },
    /**
     * Page title/description for <Head> — the base `meta` object above only
     * covers Home. Base.astro/Head.astro append " — {profile.name}" to
     * `title` automatically, so these must NOT repeat the site name.
     */
    meta: {
      projects: {
        title: "Proyectos",
        description:
          "Proyectos reales de Jhonier Negrete: orquestación de agentes y gobernanza LLM, productos propios, visión artificial y herramientas open source.",
      },
      services: {
        title: "Servicios",
        description:
          "Consultoría e implementación de IA para empresas: diagnóstico, agentes y RAG con evaluación desde el día uno, gobernanza LLM.",
      },
    },
  },
  en: {
    home: {
      globeAriaLabel: "Animated globe centered on Medellín, Colombia",
      satLabel: "SAT — LINK ACTIVE",
    },
    meta: {
      projects: {
        title: "Work",
        description:
          "Real projects by Jhonier Negrete: agent orchestration and LLM governance, own products, computer vision and open source tools.",
      },
      services: {
        title: "Services",
        description:
          "AI consulting and implementation for companies: diagnosis, agents and RAG with evaluation from day one, LLM governance.",
      },
    },
  },
} as const satisfies Record<Lang, unknown>;

export function getUiExtra(lang: Lang) {
  return uiExtra[lang];
}
