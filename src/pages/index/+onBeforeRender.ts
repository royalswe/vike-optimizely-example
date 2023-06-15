import type { PageContext } from '@/renderer/types';

import { createApp } from '@/renderer/app'
import contentService from '@/services/contentService';
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage';


async function onBeforeRender(pageContext: PageContext) {
  // pinia store
  const { store } = createApp(pageContext)
  const initialStoreState = store.state.value

  const [marketPage, getChildren] = await Promise.all([
    contentService.getContent(),
    contentService.getChildren()
  ]);

  const marketPages = getChildren.filter((p: any) => {
    return (
      p.url &&
      p.marketLocationCode &&
      p.marketLocationCode != '' &&
      p.marketSelectorName &&
      p.marketSelectorName != ''
    );
  });

  if (!marketPage && !marketPages) {
    const errorInfo = `Could not fetch data for start page`;
    throw RenderErrorPage({ pageContext: { is404: false, pageProps: { errorInfo } } });
  }

  return {
    pageContext: {
      pageProps: {
        page: marketPage,
        marketPages: marketPages,
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