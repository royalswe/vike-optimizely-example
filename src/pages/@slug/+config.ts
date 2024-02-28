import type { Config } from 'vike/types';

// https://vite-plugin-ssr.com/config
export default {
  passToClient: [
    'pageProps',
    'initialStoreState',
    'locale',
    'user',
    'documentProps',
    'currentPage',
    'siteSettings',
  ],
  meta: {
    onBeforeRender: {
      //onBeforeRender ony runs on the server
      env: { server: true, client: false },
    },
  },
} satisfies Config;
