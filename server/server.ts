import Fastify from 'fastify';
import { root } from './root.js';
import { renderPage } from 'vike/server';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';
export const IS_AZURE = process.env.IS_AZURE === 'true';

const fastifyOptions = IS_PRODUCTION
  ? {}
  : {
      logger: false,
      http2: true,
      https: {
        key: (await import('fs')).readFileSync('cert/dev.pem'),
        cert: (await import('fs')).readFileSync('cert/cert.pem'),
      },
    };

async function buildServer() {
  // always dev in this branch
  const app = Fastify(fastifyOptions);

  await app.register(import('@fastify/compress'), { global: true });

  if (IS_PRODUCTION) {
    const globalWithDevTools = global as typeof globalThis & {
      __VUE_PROD_DEVTOOLS__: boolean;
    };
    globalWithDevTools.__VUE_PROD_DEVTOOLS__ = false;

    await app.register(import('@fastify/static'), {
      root: root + '/client',
      wildcard: false, // globs the filesystem for all defined files in the client folder
    });
  } else {
    // We instantiate Vite's development server and integrate its middleware to our server.
    // ⚠️ We instantiate it only in development. (It isn't needed in production and it
    // would unnecessarily bloat our production server.)
    const vite = await import('vite');
    const viteDevMiddleware = (
      await vite.createServer({
        server: {
          middlewareMode: true,
        },
      })
    ).middlewares;

    // this is middleware for vite's dev servert
    app.addHook('onRequest', async (request, reply) => {
      const next = () =>
        new Promise<void>((resolve) => {
          viteDevMiddleware(request.raw, reply.raw, () => resolve());
        });
      await next();
    });
  }

  app.get('*', async (request, reply) => {
    const pageContextInit = {
      urlOriginal: request.raw.url || '',
      redirectTo: null,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (pageContext.redirectTo) {
      return reply.redirect(307, pageContext.redirectTo);
    } else if (!httpResponse) {
      reply.callNotFound();
      return;
    } else {
      const { statusCode, headers } = httpResponse;

      headers.forEach(([name, value]: [string, string]) =>
        reply.raw.setHeader(name, value)
      );
      reply.status(statusCode);

      httpResponse.pipe(reply.raw);
      return reply;
    }
  });

  return app;
}

async function main() {
  const fastify = await buildServer();

  const port = process.env.PORT || 4000;
  if (IS_AZURE) {
    // use bellow row instead for Azure App Service in windows environment
    // fastify.listen({ path: String(PORT), host: '0.0.0.0.' }, (err) => {
    // Port and host is for docker container
    fastify.listen({ port: 8080, host: '0.0.0.0' }, (err) => {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      console.log('Server is running');
    });
  } else {
    fastify.listen({ port: +port }, function(err, address) {
      if (err) {
        fastify.log.error(err);
        process.exit(1);
      }
      console.log(`Server listening at ${address}`);
    });
  }
}

main();
