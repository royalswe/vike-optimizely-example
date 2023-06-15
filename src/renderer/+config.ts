import type { Config } from 'vite-plugin-ssr/types'
import { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd } from './onPageTransitionHooks'

// https://vite-plugin-ssr.com/config
export default {
  clientRouting: true,
  prefetchStaticAssets: 'viewport', // viewport, hover, false
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // Here we can define which part should be rendered on server and which part on client
  meta: {
    // Create new config 'title'
    title: {
      env: 'server-and-client'
    },
    Layout: {
      env: 'server-and-client'
    }
  }
} satisfies Config
