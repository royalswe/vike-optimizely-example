import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'initialStoreState', 'locale', 'user', 'market', 'documentProps'],
  // https://vite-plugin-ssr.com/meta
  meta: {
    // this is the default behavior, you can omit it
    onBeforeRender: {
      env: 'server-only'
    }
  }
} satisfies Config
