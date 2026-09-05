/**
 * Route matrix + language toggle helper.
 *
 * Source of truth for every localized slug in the site (design.md, Decision 2).
 * Never concatenate a raw "/en" prefix to a Spanish slug — always look the
 * equivalent up here so ES and EN can diverge (e.g. /proyectos/ vs /en/projects/).
 */

export type Lang = 'es' | 'en';

export const LOCALES: Lang[] = ['es', 'en'];
export const DEFAULT_LOCALE: Lang = 'es';

export type PageKey = 'home' | 'projects' | 'services' | 'about' | 'blog' | 'contact';

/** Physical, trailing-slash-terminated route per page key and language. */
export const routes: Record<PageKey, Record<Lang, string>> = {
  home: { es: '/', en: '/en/' },
  projects: { es: '/proyectos/', en: '/en/projects/' },
  services: { es: '/servicios/', en: '/en/services/' },
  about: { es: '/sobre-mi/', en: '/en/about/' },
  blog: { es: '/blog/', en: '/en/blog/' },
  contact: { es: '/contacto/', en: '/en/contact/' },
};

export function otherLang(lang: Lang): Lang {
  return lang === 'es' ? 'en' : 'es';
}

/** Absolute path (with trailing slash) for a static page key in a given language. */
export function localizedPath(page: PageKey, lang: Lang): string {
  return routes[page][lang];
}

/** Blog index path for a language. */
export function blogIndexPath(lang: Lang): string {
  return routes.blog[lang];
}

/** Blog post detail path for a language + slug. */
export function blogPostPath(lang: Lang, slug: string): string {
  return `${routes.blog[lang]}${slug}/`;
}

/** Series hub path (pages are introduced in PR (b)). */
export function blogSeriesPath(lang: Lang, seriesId: string): string {
  return lang === 'es' ? `/blog/serie/${seriesId}/` : `/en/blog/series/${seriesId}/`;
}

/** Topic hub path (pages are introduced in PR (b)). */
export function blogTopicPath(lang: Lang, tag: string): string {
  return lang === 'es' ? `/blog/tema/${tag}/` : `/en/blog/topic/${tag}/`;
}

/** RSS feed path for a language (Decision 4 / task 3.7). */
export function rssPath(lang: Lang): string {
  return lang === 'es' ? '/rss.xml' : '/en/rss.xml';
}

interface LangToggleOptions {
  /** Current language of the page being viewed. */
  lang: Lang;
  /** Which static page the visitor is on. */
  page: PageKey;
  /**
   * When `page` is 'blog' and the visitor is on a post detail (not the index),
   * pass the slug of that post in the OTHER language if a translation exists.
   * Omit (or leave undefined) when there is no translation — the toggle then
   * falls back to the other language's blog index, per spec (never a 404).
   */
  translatedSlug?: string;
  /** Set true when on a blog post detail page (vs. the blog index). */
  isBlogPost?: boolean;
}

/**
 * Resolves the href the language-toggle control should point to.
 * Blog posts without a translation fall back to the other language's blog
 * index — defined behavior, never a broken link.
 */
export function getLangToggleHref({ lang, page, translatedSlug, isBlogPost }: LangToggleOptions): string {
  const target = otherLang(lang);

  if (page === 'blog' && isBlogPost) {
    return translatedSlug ? blogPostPath(target, translatedSlug) : blogIndexPath(target);
  }

  return localizedPath(page, target);
}
