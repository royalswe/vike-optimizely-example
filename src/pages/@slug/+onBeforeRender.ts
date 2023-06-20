// https://vite-plugin-ssr.com/onBeforeRender
import type { PageContext } from '@/renderer/types';

import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage';
import { createApp } from '@/renderer/app'

// This will run on every page request that is not defined in the pages folder
async function onBeforeRender(pageContext: PageContext) {
  // pinia store  
  const { store } = createApp(pageContext)
  const initialStoreState = store.state.value;

  // fake a fetch request to get page meta data
  const documentProps = { title: 'meta title', metaDescription: 'meta description.', metaKeywords: 'ssr, spa, vite, vue' }

  if (!documentProps) {
    const errorInfo = 'could not get meta data for page'
    throw RenderErrorPage({
      pageContext: { is404: false, pageProps: { errorInfo } },
    });
  }

  // init navigation menu
  const navMenu = {
    menuHeading: [{ heading: 'My Header' }], // Unity workaround for menuItems with only heading
    items: [
      {
        href: 'startexample',
        text: 'Start page',
        icon: 'home'
      },
      {
        href: 'contentexample',
        text: 'Content page',
      },
      {
        text: 'Hierarchy list',
        icon: 'Home',
        children: [
          {
            text: 'Hiararchy 2',
          },
          {
            text: 'Hiararchy 2',
            icon: 'Home',
            children: [
              {
                text: 'Hiararchy 3',
                children: [
                  {
                    text: 'Hiararchy 4',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  return {
    pageContext: {
      pageProps: {
        // We remove data we don't need because we pass `pageContext.pageHiearchy` to
        // the client; we want to minimize what is sent over the network.
        navMenu
      },
      initialStoreState,
      documentProps
    },
  };
}

export default onBeforeRender;