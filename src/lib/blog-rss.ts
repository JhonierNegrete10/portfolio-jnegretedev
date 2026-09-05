import { getContainerRenderer as getMDXRenderer } from "@astrojs/mdx";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { loadRenderers } from "astro:container";
import { render } from "astro:content";
import sanitizeHtml from "sanitize-html";
import type { BlogEntry } from "./blog";

const siteOrigin = "https://jnegrete.dev";

const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "pre",
    "code",
    "blockquote",
    "strong",
    "em",
    "img",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "figure",
    "figcaption",
    "span",
  ],
  allowedAttributes: {
    a: ["href", "title"],
    img: ["src", "alt"],
  },
  transformTags: {
    a: (_tagName, attribs) => ({
      tagName: "a",
      attribs: absolutizeAttribute(attribs, "href"),
    }),
    img: (_tagName, attribs) => ({
      tagName: "img",
      attribs: absolutizeAttribute(attribs, "src"),
    }),
  },
};

function absolutizeAttribute(
  attribs: Record<string, string>,
  name: "href" | "src",
): Record<string, string> {
  const value = attribs[name];
  if (!value) return attribs;
  return { ...attribs, [name]: new URL(value, siteOrigin).href };
}

export async function createRssContainer(): Promise<AstroContainer> {
  const renderers = await loadRenderers([getMDXRenderer()]);
  return AstroContainer.create({ renderers });
}

export async function renderRssContent(
  container: AstroContainer,
  entry: BlogEntry,
): Promise<string> {
  const { Content } = await render(entry);
  const html = await container.renderToString(Content);
  return sanitizeHtml(html, sanitizeOptions);
}
