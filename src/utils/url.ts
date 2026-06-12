// Returns the internal path prefixed with the configured BASE_URL.
// In dev: BASE_URL = '/'  → url('/page') = '/page'
// In GitHub Pages: BASE_URL = '/distrito-pc-demo/' → url('/page') = '/distrito-pc-demo/page'
const _base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function url(path: string): string {
  return `${_base}${path}`;
}
