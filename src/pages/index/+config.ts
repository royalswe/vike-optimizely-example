import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'title', 'initialStoreState', 'locale', 'user', 'market', 'documentProps', 'marketLocationCode'],
  // https://vite-plugin-ssr.com/meta
  meta: {
    // Create new config 'title'
    onBeforeRender: {
      env: 'server-only'
    }
  }
} satisfies Config
