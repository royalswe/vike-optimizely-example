import type { PageContext } from '#src/renderer/types';

import { createApp } from '#src/renderer/app';

async function onBeforeRender(pageContext: PageContext) {
  // pinia store
  const { store } = createApp(pageContext);
  const initialStoreState = store.state.value;

  return {
    pageContext: {
      pageProps: {
        page: 'props from onBeforeRender',
        marketPages: [
          { name: 'Sweden', url: '/sv/se' },
          { name: 'Great Britain', url: '/en/gb' },
          { name: 'Denmark', url: '/dk/dk' },
        ],
      },
      documentProps: {
        title: 'meta title',
        metaDescription: 'meta description.',
        metaKeywords: 'ssr, spa, vite, vue',
      },
      initialStoreState,
    },
  };
}

export default onBeforeRender;
