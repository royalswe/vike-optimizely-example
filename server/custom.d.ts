declare module '@small-tech/https' {
  import * as http from 'http';

  function createServer(
    app: http.ServerRequestListener,
    options?: {
      cert?: string;
      key?: string;
      port?: number;
    }
  ): http.Server;

  export { createServer };
}
