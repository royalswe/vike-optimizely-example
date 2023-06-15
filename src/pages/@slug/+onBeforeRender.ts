// https://vite-plugin-ssr.com/onBeforeRender
import type { PageContext } from '@/renderer/types';

import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage';
import { getRootMenuPage, getPageByPath } from '@/router/routeHandler'
import navigationService from '@/services/navigationService';
import { createApp } from '@/renderer/app'
import httpService from '@/services/httpService';
import contentService from '@/services/contentService';
import pageService from '@/services/pageService';
import { useCommonStore } from '@/stores/commonStore';

// This will run on every page except start and error page
// Fetch most of the data from optimizely before rendering the page
async function onBeforeRender(pageContext: PageContext) {
  // pinia store  
  const { store } = createApp(pageContext)
  const initialStoreState = store.state.value;

  const { rootMenu, marketPageId, marketPagePath } = await getRootMenuPage(pageContext);
  if (!rootMenu) {
    const errorInfo = 'could not get menu'
    throw RenderErrorPage({
      pageContext: { is404: false, pageProps: { errorInfo } },
    });  
  }

  const currentPage = await getPageByPath(pageContext);
  
  if (!currentPage) {
    const errorInfo = 'could not find current page'
    throw RenderErrorPage({
      pageContext: { is404: false, pageProps: { errorInfo } },
    });
  }
  const navMenu = {
    menuHeading: [{ heading: marketPageId != currentPage.id && currentPage.Name}], // Unity workaround for menuItems with only heading
    items: navigationService.MapPageToMenuItem(rootMenu.Children.filter((c: any) => c.ShowInMenu)),
  };

  const [getNotices, getChildNotices, documentProps] = await Promise.all([ // TODO: promise.allsettled maybe?
    httpService.get(`/_api/notices/${currentPage.Id}`),
    httpService.get(`/_api/notices/children/${currentPage.Id}`),
    contentService.getContent(currentPage.Id, {language: currentPage.Language, PageUrl: currentPage.UrlName, expand: '*'}),
    pageService.setSiteSettings(currentPage.Id, useCommonStore()),
  ]);

  //TODO: confirm this
  documentProps.hasContainer = documentProps.hasContainer === undefined ? true : documentProps.hasContainer;
  
  return {
    pageContext: {
      pageProps: {
        // We remove data we don't need because we pass `pageContext.pageHiearchy` to
        // the client; we want to minimize what is sent over the network.
        navMenu,
        notices: getNotices,
        childNotices: getChildNotices,
        route : { marketPageId, marketPagePath},
      },
      initialStoreState,
      currentPage,
      documentProps
    },
  };
}

export default onBeforeRender;