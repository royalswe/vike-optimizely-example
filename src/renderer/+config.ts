import type { Config } from 'vike/types';
import {
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
} from './onPageTransitionHooks';

// https://vike.dev/config
export default {
  passToClient: ['documentProps', 'locale'],
  clientRouting: true,
  prefetchStaticAssets: 'viewport', // viewport, hover, false TODO: compare hover with viewport in produktion (viewport only works in production)?
  onHydrationEnd,
  onPageTransitionStart,
  onPageTransitionEnd,
  // Here we can define which part should be rendered on server and which part on client
  meta: {
    Layout: {
      env: { server: true, client: true }
    },
  },
} satisfies Config;
