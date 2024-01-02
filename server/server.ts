import express from 'express';
import compression from 'compression';
import path from 'path';
import './config.js';
import { IS_PRODUCTION, IS_AZURE, PORT } from './constants.js';
import router from './routes/default.js';
import api from './routes/api.js';

startServer();

async function startServer() {
  const app = express(); // express makes routes and middleware easier to work with
  app.use(compression()); // use compression to compress the responses

  if (IS_PRODUCTION) {
    // If applicationinsights is used in Azure
    if (IS_AZURE) {
      const appInsights = await import('applicationinsights');
      appInsights.setup().start();
    }

    const globalWithDevTools = global as typeof globalThis & {
      __VUE_PROD_DEVTOOLS__: boolean;
    };
    globalWithDevTools.__VUE_PROD_DEVTOOLS__ = false;

    const sirv = (await import('sirv')).default;
    app.use(sirv('./dist/client'));
  } else {
    console.log('Starting development server: ');
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        server: {
          middlewareMode: true,
        },
      })
    ).middlewares;
    app.use(viteDevMiddleware);
  }

  // redirect to trailing slash if not exist
  app.use((req, res, next) => {
    const url = req.url;
    const lastSegment = path.basename(url);

    if (
      !path.extname(lastSegment) && // if last segment does not have an extension
      url.slice(-1) !== '/' && // if last character is not a slash
      Object.keys(req.query).length === 0 // if query string is empty
    ) {
      res.redirect(301, url + '/'); // redirect to trailing slash
    } else {
      next();
    }
  });

  app.use(router);
  app.use('/_api', api);

  // HTTPS: In production, Vite + vike is only a server middleware; there is nothing special to take into consideration.
  // If we want to use HTTPS in dev as well, then we need to pass the HTTPS certificates to Vite's dev server.
  if (IS_AZURE) {
    app.listen(PORT);
  } else {
    const fs = await import('fs');
    const https = await import('https');

    // vite-plugin-mkcert will generate certificates, move them to cert folder if you want to use HTTPS in dev
    const options = {
      key: fs.readFileSync('cert/dev.pem'),
      cert: fs.readFileSync('cert/cert.pem'),
      hostname: 'localhost',
      port: PORT,
    };

    const server = https.createServer(options, app);
    server.listen(PORT, () => {
      console.log(` 🎉 Server running at https://${options.hostname}:${PORT}`);
    });
  }
}
