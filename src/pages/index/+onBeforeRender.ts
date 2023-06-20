import type { PageContext } from '@/renderer/types';

import { createApp } from '@/renderer/app'
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage';


async function onBeforeRender(pageContext: PageContext) {
  // pinia store
  const { store } = createApp(pageContext)
  const initialStoreState = store.state.value

  // if there is no initial store state, throw an error and the error page will be rendered
  // remove is404: false to render the error page as a 404 page, otherwise it will be rendered as a 500 page
  if (!initialStoreState) {
    const errorInfo = `Pinia store state is undefined.`;
    throw RenderErrorPage({ pageContext: { is404: false, pageProps: { errorInfo } } });
  }

  return {
    pageContext: {
      pageProps: {
        page: 'props from onBeforeRender',
        marketPages: [{name: 'star wars', url: '/star-wars'}, {name: 'Hello page', url: '/hello/alice'}, {name: 'Swedens market', url: '/sv-se/slug'}]
      },
      documentProps: {
        title: 'meta title',
        metaDescription: 'meta description.',
        metaKeywords: 'ssr, spa, vite, vue'
      },
      initialStoreState
    },
  };
}

export default onBeforeRender;