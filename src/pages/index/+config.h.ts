import type { Config } from 'vike/types';

// https://vite-plugin-ssr.com/config
export default {
  passToClient: [
    'pageProps',
    'initialStoreState',
    'locale',
    'user',
    'market',
    'documentProps',
  ],
  // https://vite-plugin-ssr.com/meta
  meta: {
    // this is the default behavior, you can omit it
    onBeforeRender: {
      env: { server: true, client: false },
    },
  },
} satisfies Config;
