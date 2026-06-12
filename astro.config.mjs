import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  integrations: [tailwind()],
  site: 'https://tallerdedigitalizacion.github.io',
  base: '/distrito-pc-demo',
});
