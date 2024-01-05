import type { Config } from 'vike/types';

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'user', 'documentProps'],
  // https://vite-plugin-ssr.com/meta
  meta: {
    // Runs on the server only
    onBeforeRender: {
      env: { server: true, client: false },
    },
  },
} satisfies Config;
