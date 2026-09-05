/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BLOG_INCLUDE_DRAFTS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
