/**
 * This Hook is called before every route change and it is the first hook that is called.
 * This file is used to extract the locale from the url and pass it to the pageContext.
 * example: /sv/se/my/url -> locale: sv, market: /sv/se/, urlWithoutLocale: /mu/url
 */
const languages = {
  en: '/en/global',
  sv: '/sv/se',
  da: '/da/dk',
  et: '/et/ee',
  lv: '/lv/lv',
};

function onBeforeRoute(pageContext: { urlOriginal: string }) {
  const { locale, market, urlWithoutLocale, businessArea } = extractLocale(
    pageContext.urlOriginal
  );

  return {
    pageContext: {
      locale, // ex: sv
      market, // ex: sv/se
      urlWithoutLocale, // removes market from url ex: /sv/se/trees/pine -> /trees/pine
      businessArea, // market + business area ex: /sv/se/trees/pine -> /sv/se/trees
    },
  };
}

function extractLocale(
  url: string
): {
  locale: string;
  market: string;
  urlWithoutLocale: string;
  businessArea: string;
} {
  // Default values
  let locale = 'en';
  let market = languages.en;
  let urlWithoutLocale = url;
  let businessArea = '';

  Object.entries(languages).forEach(([key, value]) => {
    if (url.includes(value)) {
      locale = key;
      market = value;
      urlWithoutLocale = urlWithoutLocale
        .replace(value, '') // Remove market from url
        .replace('index.pageContext.json', ''); // index.pageContext.json string is added when using client routing and server only is set inside +onBeforeRender
      businessArea = urlWithoutLocale.split('/')[1]; // get business area from url if exist
    }
  });
  return { locale, market, urlWithoutLocale, businessArea };
}

export default onBeforeRoute;
