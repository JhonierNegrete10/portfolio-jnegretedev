export function includeDrafts(): boolean {
  return process.env.BLOG_INCLUDE_DRAFTS === '1';
}
