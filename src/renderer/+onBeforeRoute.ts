import type { PageContext } from './types';

import urlService from '#src/services/urlService';

/**
 * This Hook is called before every route change and it is the first hook that is called.
 * This file is used to extract the locale from the url and pass it to the pageContext.
 * example: /sv/se/my/url -> locale: sv, market: /sv/se/, urlWithoutMarketAndLocale: /mu/url
 */
function onBeforeRoute(pageContext: PageContext) {
  const { locale, market, urlWithoutMarketAndLocale, businessArea } =
    urlService.extractUrlSegments(pageContext.urlParsed.pathname);

  return {
    pageContext: {
      locale: locale || pageContext.locale, // sv
      market, // /sv/se/
      urlWithoutMarketAndLocale, // path without market sv/se/tra/min-skog -> /tra/min-skog
      businessArea, // first part of url after market sv/se/tra/min-skog -> tra
      // Overwrite `pageContext.urlOriginal`, use it if we pages without market as default
      //urlOriginal: urlWithoutMarketAndLocale
    },
  };
}

export default onBeforeRoute;
