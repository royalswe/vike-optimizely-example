// https://vike.dev/onBeforeRender
import type { PageContext } from '#src/renderer/types';

import { render } from 'vike/abort';
import { fetchPageHierarchy } from '#src/router/hierarchy.server';
import {
  getRootMenuPage,
  getPageByPath,
  setPageHierarchy,
} from '#src/router/routeHandler';
import httpService from '#src/services/httpService';
import pageService from '#src/services/pageService';
import urlService from '#src/services/urlService';
import navigationService from '#src/services/navigationService';

async function onBeforeRender(pageContext: PageContext) {
  // // const pageHierarchy = await fetchPageHierarchy(
  // //   pageContext.locale,
  // //   pageContext.isPreview
  // // );

  // // for demo purpose we use mock data
  const pageHierarchy: any = await import('#src/mock-data/pageHierarchy.json');

  setPageHierarchy(pageHierarchy);

  const { rootMenu, marketPageId, marketPagePath } =
    await getRootMenuPage(pageContext);

  // include children, exclude them if not needed for performance
  const pageResult = await getPageByPath(pageContext);
  const currentPage = pageResult.currentPage;

  if (!currentPage) {
    throw render(404);
  }

  if (pageContext.market === '') {
    pageContext = {
      ...pageContext,
      ...urlService.extractUrlSegments(currentPage.Url),
    } as PageContext;
  }

  const siteSettings = await pageService.getSiteSettings(
    currentPage?.Id ?? pageResult.parentPage.Id,
    false,
    pageContext.locale
  );

  // Map to menu item
  const navMenu = navigationService.MapPageToMenuItem(
    rootMenu?.Children.filter((c: any) => c.ShowInMenu)
  );

  // const [getNotices, getChildNotices, documentProps] = await Promise.all([
  //   httpService.get(`/_api/notices/${currentPage.Id}`),
  //   httpService.get(`/_api/notices/children/${currentPage.Id}`),
  //   contentService.getContent(
  //     currentPage.Id,
  //     currentPage.Language,
  //     {
  //       pageUrl: currentPage.Url,
  //       expand: '*',
  //     },
  //     pageContext.requestCookie || ''
  //   ),
  // ]);

  // mock some data from json file
  const documentProps: any = await import('#src/mock-data/siteSettings.json');

  documentProps.hasContainer =
    documentProps.hasContainer === undefined
      ? false
      : documentProps.hasContainer;

  // redirect from node server
  const redirectTo = documentProps.redirectTo
    ? documentProps.redirectTo.url ?? undefined
    : undefined;

  return {
    pageContext: {
      redirectTo: redirectTo,
      pageProps: {
        navMenu,
        route: { marketPageId, marketPagePath },
      },
      siteSettings,
      currentPage,
      documentProps,
      marketPageId: marketPageId ?? currentPage.Id,
    },
  };
}

export default onBeforeRender;
