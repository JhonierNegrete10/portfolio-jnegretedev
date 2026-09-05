import { createRequire } from "node:module";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const loadCommonJs = createRequire(import.meta.url);
const sax = loadCommonJs("sax");
const projectRoot = path.resolve(import.meta.dirname, "..");
const distDirectory = path.join(projectRoot, "dist");
const siteOrigin = "https://jnegrete.dev";
const failures = [];

function fail(url, rule, detail) {
  failures.push(`${url} — ${rule}: ${detail}`);
}

function attributes(tag) {
  const result = new Map();
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)) {
    result.set(match[1].toLowerCase(), match[3]);
  }
  return result;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, "gi"))].map(
    (match) => ({ raw: match[0], attrs: attributes(match[0]) }),
  );
}

function assertWellFormedXml(xml, url) {
  const parser = sax.parser(true);
  let parseError;
  parser.onerror = (error) => {
    parseError = error;
    parser.resume();
  };
  parser.write(xml).close();
  if (parseError) fail(url, "valid XML", parseError.message);
}

function postArtifacts() {
  const roots = [
    { directory: path.join(distDirectory, "blog"), prefix: "/blog/" },
    { directory: path.join(distDirectory, "en", "blog"), prefix: "/en/blog/" },
  ];
  const posts = [];

  for (const root of roots) {
    if (!existsSync(root.directory)) continue;
    for (const entry of readdirSync(root.directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const htmlPath = path.join(root.directory, entry.name, "index.html");
      if (existsSync(htmlPath))
        posts.push({ url: `${root.prefix}${entry.name}/`, htmlPath });
    }
  }
  return posts;
}

function verifyPost({ url, htmlPath }) {
  const html = readFileSync(htmlPath, "utf8");
  const canonicalLinks = tags(html, "link").filter((tag) =>
    tag.attrs.get("rel")?.split(/\s+/).includes("canonical"),
  );
  if (canonicalLinks.length !== 1) {
    fail(
      url,
      "canonical",
      `expected exactly one canonical link, found ${canonicalLinks.length}`,
    );
  } else {
    const href = canonicalLinks[0].attrs.get("href") ?? "";
    try {
      new URL(href);
    } catch (error) {
      fail(
        url,
        "canonical absolute URL",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const jsonLdScripts = [
    ...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi),
  ].filter(
    (match) => attributes(match[1]).get("type") === "application/ld+json",
  );
  const postingScripts = jsonLdScripts.filter((match) =>
    match[2].includes("BlogPosting"),
  );
  if (postingScripts.length !== 1) {
    fail(
      url,
      "BlogPosting JSON-LD",
      `expected exactly one matching script, found ${postingScripts.length}`,
    );
  } else {
    try {
      JSON.parse(postingScripts[0][2]);
    } catch (error) {
      fail(
        url,
        "valid BlogPosting JSON-LD",
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  const ogTypes = tags(html, "meta").filter(
    (tag) => tag.attrs.get("property") === "og:type",
  );
  if (ogTypes.length !== 1 || ogTypes[0].attrs.get("content") !== "article") {
    fail(
      url,
      "og:type=article",
      `found ${ogTypes.map((tag) => tag.attrs.get("content")).join(", ") || "none"}`,
    );
  }

  const ogImages = tags(html, "meta").filter(
    (tag) => tag.attrs.get("property") === "og:image",
  );
  if (ogImages.length !== 1 || !ogImages[0].attrs.get("content")) {
    fail(
      url,
      "og:image",
      `expected exactly one non-empty value, found ${ogImages.length}`,
    );
  } else {
    const source = ogImages[0].attrs.get("content");
    try {
      const imageUrl = new URL(source, siteOrigin);
      if (imageUrl.origin === siteOrigin) {
        const localPath = path.join(
          distDirectory,
          decodeURIComponent(imageUrl.pathname).replace(/^\//, ""),
        );
        if (!existsSync(localPath))
          fail(url, "local og:image exists", `missing ${imageUrl.pathname}`);
      }
    } catch (error) {
      fail(
        url,
        "valid og:image URL",
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}

function translatedPairs() {
  const contentDirectory = path.join(projectRoot, "src", "content", "blog");
  const pairs = new Map();
  for (const name of readdirSync(contentDirectory)) {
    if (name.startsWith("_") || !/\.mdx?$/.test(name)) continue;
    const { data } = matter(
      readFileSync(path.join(contentDirectory, name), "utf8"),
    );
    if (!data.translationKey || (data.lang !== "es" && data.lang !== "en"))
      continue;
    const pair = pairs.get(data.translationKey) ?? {};
    pair[data.lang] = name.replace(/\.mdx?$/, "");
    pairs.set(data.translationKey, pair);
  }
  return [...pairs.values()].filter((pair) => pair.es && pair.en);
}

function verifyReciprocalHreflang(pair) {
  const es = {
    url: `/blog/${pair.es}/`,
    file: path.join(distDirectory, "blog", pair.es, "index.html"),
    lang: "en",
    expected: `${siteOrigin}/en/blog/${pair.en}/`,
  };
  const en = {
    url: `/en/blog/${pair.en}/`,
    file: path.join(distDirectory, "en", "blog", pair.en, "index.html"),
    lang: "es",
    expected: `${siteOrigin}/blog/${pair.es}/`,
  };
  if (!existsSync(es.file) || !existsSync(en.file)) return;

  for (const side of [es, en]) {
    const alternates = tags(readFileSync(side.file, "utf8"), "link").filter(
      (tag) => tag.attrs.get("rel")?.split(/\s+/).includes("alternate"),
    );
    const actual = alternates
      .find((tag) => tag.attrs.get("hreflang") === side.lang)
      ?.attrs.get("href");
    if (actual !== side.expected)
      fail(
        side.url,
        "reciprocal hreflang",
        `expected ${side.expected}, found ${actual ?? "none"}`,
      );
  }
}

if (!existsSync(distDirectory)) {
  console.error(
    "dist/ — build artifact: directory does not exist; run npm run build first.",
  );
  process.exit(1);
}

const posts = postArtifacts();
const postLanguages = new Set(
  posts.map(({ url }) => (url.startsWith("/en/blog/") ? "en" : "es")),
);
for (const post of posts) verifyPost(post);
for (const pair of translatedPairs()) verifyReciprocalHreflang(pair);

const sitemapPath = path.join(distDirectory, "sitemap-0.xml");
if (!existsSync(sitemapPath)) {
  fail("/sitemap-0.xml", "sitemap exists", "file is missing");
} else {
  const sitemap = readFileSync(sitemapPath, "utf8");
  assertWellFormedXml(sitemap, "/sitemap-0.xml");
  const urlBlocks = [...sitemap.matchAll(/<url>([\s\S]*?)<\/url>/g)];
  for (const [index, match] of urlBlocks.entries()) {
    const location =
      match[1].match(/<loc>(.*?)<\/loc>/)?.[1] ?? `entry ${index + 1}`;
    const hasLastmod = /<lastmod>[^<]+<\/lastmod>/.test(match[1]);
    let pathname;
    try {
      pathname = new URL(location, siteOrigin).pathname;
    } catch (error) {
      fail(
        location,
        "sitemap location",
        error instanceof Error ? error.message : String(error),
      );
      continue;
    }
    const language = pathname.startsWith("/en/blog/")
      ? "en"
      : pathname.startsWith("/blog/")
        ? "es"
        : undefined;
    if (language && postLanguages.has(language) && !hasLastmod) {
      fail(location, "sitemap lastmod", "element is missing or empty");
    } else if (!language && hasLastmod) {
      fail(
        location,
        "sitemap lastmod",
        "element must be absent for non-blog URLs",
      );
    }
  }
}

for (const feed of ["/rss.xml", "/en/rss.xml"]) {
  const feedPath = path.join(distDirectory, feed.replace(/^\//, ""));
  if (!existsSync(feedPath)) {
    fail(feed, "RSS exists", "file is missing");
    continue;
  }
  const xml = readFileSync(feedPath, "utf8");
  assertWellFormedXml(xml, feed);
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];
  for (const [index, item] of items.entries()) {
    if (!/<content(?::encoded)?\b/.test(item[1]))
      fail(
        `${feed}#item-${index + 1}`,
        "RSS full content",
        "content:encoded/content is missing",
      );
  }
}

if (failures.length) {
  console.error(`Blog artifact verification failed (${failures.length}):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Blog artifact verified: ${posts.length} post(s), sitemap lastmod complete, 2 RSS feed(s) valid.`,
);
