// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
import express from 'express';
import compression from 'compression';
import { renderPage } from 'vite-plugin-ssr/server';
import https from '@small-tech/https';

// get root directory
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/..`;

const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 3000;

startServer();

async function startServer() {
  const app = express();

  app.use(compression());

  if (isProduction) {
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        root,
        server: {
          middlewareMode: true,
        },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  app.get('/', (req, res, next) => {
    const redirectStartPage =
      getCookieValue(req.headers.cookie, '.UserSelectedStartPageUrl') ||
      getCookieValue(req.headers.cookie, '.LastVisitedStartPageUrl');

    if (redirectStartPage) {
      return res.redirect(307, redirectStartPage);
    }
    next();
  });

  app.get('*', async (req, res, next) => {
    const pageContextInit = {
      fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      urlOriginal: req.originalUrl,
      headers: req.headers,
      cookies: req.headers.cookie,
      redirectTo: null,
    };

    const pageContext = await renderPage(pageContextInit);

    if (pageContext.redirectTo) {
      return res.redirect(307, pageContext.redirectTo);
    }

    const { httpResponse } = pageContext;

    if (!httpResponse) return next();

    const { statusCode, contentType, earlyHints } = httpResponse;

    // https://vite-plugin-ssr.com/preload#early-hints
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    res.status(statusCode).type(contentType);

    // ensures that the content of the server-rendered page is streamed back to the client's response
    httpResponse.pipe(res);
  });

  // HTTPS: In production, Vite + vite-plugin-ssr is only a server middleware; there is nothing special to take into consideration.
  // If we want to use HTTPS in dev as well, then we need to pass the HTTPS certificates to Vite's dev server.
  if (isProduction) {
    app.listen(port);
  } else {
    const server = https.createServer(app);
    server.listen(port, () => {
      console.log(` 🎉 Server running at https://localdev.com:${port}`);
    });
  }
}

/**
 * Get cookie value from request header by its name
 */
function getCookieValue(cookieHeader: any, cookieName: string): string | null {
  if (cookieHeader) {
    const regex = new RegExp(`(?:^| )${cookieName}=([^;]*)`);
    const match = cookieHeader.match(regex);
    if (match) {
      return match[1];
    }
  }
  return null;
}
