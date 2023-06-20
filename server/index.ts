// Note that this file isn't processed by Vite, see https://github.com/brillout/vite-plugin-ssr/issues/562
import express from 'express';
import compression from 'compression';
import { renderPage } from 'vite-plugin-ssr/server';
import https from '@small-tech/https'; // includes self-signed certificate generation

import root from './root.js'; // value to find the root of the project

const isProduction = process.env.NODE_ENV === 'production'; // set the environment to production when running in production
const port = process.env.PORT || 3000; // set the port to 3000 or the environment variable PORT

startServer();

async function startServer() {
  const app = express(); // use express as the server for simplicity

  app.use(compression()); // use compression to compress the response

  if (isProduction) {
    // if we are in production, use the dist/client folder and vite is never used
    const sirv = (await import('sirv')).default;
    app.use(sirv(`${root}/dist/client`));
  } else {
    // if we are in development, use vite to serve the files
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
    const redirectStartPage = getCookieValue(
      req.headers.cookie,
      'selectedStartPage'
    );
    // if user has selected a start page, redirect to that page instead of showing the default start page
    if (redirectStartPage) {
      return res.redirect(307, redirectStartPage);
    }
    // if no start page is selected then go on with the route bellow
    next();
  });

  app.get('*', async (req, res, next) => {
    // fill the pageContext with the request information that we need in the app later
    const pageContextInit = {
      fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      urlOriginal: req.originalUrl,
      headers: req.headers,
      cookies: req.headers.cookie,
      redirectTo: null,
    };

    // this part will run +onBeforeRender.ts
    const pageContext = await renderPage(pageContextInit);

    // if there is a redirectTo condition inside +onBeforeRender.ts, redirect to that page instead of rendering the current page
    if (pageContext.redirectTo) {
      return res.redirect(307, pageContext.redirectTo);
    }

    const { httpResponse } = pageContext;

    if (!httpResponse) return next();

    const { statusCode, contentType, earlyHints } = httpResponse;
    // https://vite-plugin-ssr.com/preload#early-hints
    // early hints are used to preload resources that are needed for the page to render
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    // set the status code and content type of the response
    res.status(statusCode).type(contentType);

    // ensures that the content of the server-rendered page is streamed back to the client's response
    httpResponse.pipe(res);
  });

  // HTTPS: In production, Vite + vite-plugin-ssr is only a server middleware; there is nothing special to take into consideration.
  // If we want to use HTTPS in dev as well, then we need to pass the HTTPS certificates to Vite's dev server.
  // if you do not want to use HTTPS in development, you can remove the else statement and also remove the import of https
  if (isProduction) {
    app.listen(port);
  } else {
    const server = https.createServer(app);
    server.listen(port, () => {
      console.log(` 🎉 Server running at https://localhost:${port}`);
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
