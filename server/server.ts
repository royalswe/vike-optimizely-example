import Fastify from 'fastify';
import { renderPage } from 'vike/server';

async function buildServer() {
  // always dev in this branch
  const app = Fastify({ logger: false });

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

  app.get('*', async (request, reply) => {
    const pageContextInit = {
      urlOriginal: request.raw.url || '',
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) {
      reply.callNotFound();
      return;
    } else {
      const { statusCode, headers } = httpResponse;
      headers.forEach(([name, value]) => reply.header(name, value));
      reply.status(statusCode);

      // remove bellow lines
      httpResponse.pipe(reply.raw);
      return reply;
      // and uncomment bellow line and it will work
      //return reply.send(await httpResponse.getNodeStream());
    }
  });

  return app;
}

async function main() {
  const fastify = await buildServer();

  const port = process.env.PORT || 3000;
  fastify.listen({ port: +port }, function (err, address) {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
}

main();
