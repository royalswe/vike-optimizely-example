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
          { name: 'star wars', url: '/star-wars' },
          { name: 'Hello page', url: '/hello/alice' },
          { name: 'Swedens market', url: '/sv-se/slug' },
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
