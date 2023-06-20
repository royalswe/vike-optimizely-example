import type { Config } from 'vite-plugin-ssr/types'
import { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd } from './onPageTransitionHooks'

// https://vite-plugin-ssr.com/config
export default {
  passToClient: ['pageProps', 'locale'],
  clientRouting: true, // enables client-side routing and make site a single-page application after the first page load
  prefetchStaticAssets: 'viewport', // viewport, hover, false
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // Here we can define which part should be rendered on server and which part on client
  meta: {
    Layout: {
      env: 'server-and-client'
    }
  }
} satisfies Config
