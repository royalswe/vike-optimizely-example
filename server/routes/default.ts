import path from 'path';
import { Router } from 'express';
import { renderPage } from 'vike/server';
import { fetchUser } from '../accountService.js';
import { getCookieValue, getFullApiUrl, getVisitType } from '../utils.js';
import {
  LANGUAGE_TO_REDIRECT_PAGES,
  MARKET_TO_REDIRECT_PAGES,
  VISIT_TYPE,
} from '../constants.js';

const router = Router({});

/* Market page */
router.get('/', (req, res, next) => {
  const redirectStartPage =
    getCookieValue(req.headers.cookie, '.UserSelectedStartPageUrl') ||
    getCookieValue(req.headers.cookie, '.LastVisitedStartPageUrl') ||
    getCookieValue(req.headers.cookie, '.SelectedLanguage');

  if (redirectStartPage && redirectStartPage !== 'undefined') {
    return res.redirect(307, decodeURIComponent(redirectStartPage));
  }

  next();
});

// Redirect to Episerver UI on API url
router.get('/episerver/*', (req, res) => {
  return res.redirect(301, getFullApiUrl(req));
});

/* Special case for RSS. Check if resource exists at API with a HEAD request, if OK fetch content. Else go to default route. */
router.get('*/rss', async (req, res, next) => {
  const url = getFullApiUrl(req);
  const rssXmlResult = await fetch(url, { method: 'HEAD' }).then(
    async (response) => {
      if (response.status === 200) {
        return await fetch(url).then((response) => {
          return response.text();
        });
      }
    }
  );

  // If no valid RSS XML is found, continue to the next route or middleware
  if (!rssXmlResult) return next();

  res.type('application/rss+xml');
  return res.end(rssXmlResult);
});

router.get('/globalassets/*', async (req, res) => {
  try {
    const url = getFullApiUrl(req);

    const fileResponse = await fetch(url);

    if (!fileResponse.ok) {
      if (fileResponse.status === 404) {
        return res.status(404).send('File not found');
      }
      return res.status(500).send('Internal Server Error');
    }

    const fileBlob = await fileResponse.blob();

    res.type(fileBlob.type);
    return res.end(Buffer.from(await fileBlob.arrayBuffer()));
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
});

/* if only one path is specified then check if it is a market or language */
router.get('/:path', async (req, res, next) => {
  const lastSegment = path.basename(req.url);

  // Check if user requested language in url then redirect to suitable startpage/market
  if (lastSegment in LANGUAGE_TO_REDIRECT_PAGES) {
    // Redirect to market for language
    return res.redirect(
      307,
      decodeURIComponent(
        LANGUAGE_TO_REDIRECT_PAGES[
          lastSegment as keyof typeof LANGUAGE_TO_REDIRECT_PAGES
        ]
      )
    );
  }

  // Check if user requested market in url then redirect to suitable startpage/market with language
  if (lastSegment in MARKET_TO_REDIRECT_PAGES) {
    // Redirect to market with language
    return res.redirect(
      307,
      decodeURIComponent(
        MARKET_TO_REDIRECT_PAGES[
          lastSegment as keyof typeof MARKET_TO_REDIRECT_PAGES
        ]
      )
    );
  }

  next(); // probably shortlink, continue to next route
});

/* Default route */
router.get('*', async (req, res, next) => {
  const acceptLanguage =
    req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';

  const isPreview = req.query['preview'] === 'true';
  const isStyleApp = req.query['style'] === 'app';
  const visitType = getVisitType(req);

  // Add Content-Security-Policy
  if (visitType != VISIT_TYPE.Internal && visitType != VISIT_TYPE.InternalLan) {
    res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");
  }

  const user = await fetchUser(req.headers.cookie as string);

  const pageContextInit = {
    isPreview: isPreview,
    locale: acceptLanguage,
    fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
    urlOriginal: req.originalUrl,
    redirectTo: null,
    visitType: visitType,
    isStyleApp: isStyleApp,
    requestCookie: req.headers.cookie,
    user,
  };

  const pageContext = await renderPage(pageContextInit);

  // check if we have a specified redirect from +onBeforeRender.ts
  if (pageContext.redirectTo) {
    return res.redirect(307, pageContext.redirectTo);
  }

  const { httpResponse } = pageContext;

  if (!httpResponse) return next();

  const { statusCode, headers } = httpResponse;
  // https://vike.dev/preload#early-hints
  // will probably be usefull
  // if (res.writeEarlyHints) {
  //   res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
  // }

  res.status(statusCode);
  headers.forEach(([name, value]) => res.setHeader(name, value));

  // ensures that the content of the server-rendered page is streamed back to the client's response
  httpResponse.pipe(res);
});

export default router;
