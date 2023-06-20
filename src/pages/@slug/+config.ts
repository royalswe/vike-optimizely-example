import type { Config } from 'vite-plugin-ssr/types'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'initialStoreState', 'locale', 'user', 'market', 'documentProps'],
  route: '/@language/*',
  meta: {
    // Create new config 'title'
    onBeforeRender: {
      //env: 'server-and-client'
      env: 'server-only' 
    }
  }
} satisfies Config
