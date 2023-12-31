import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import vike from 'vike/plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // if you want to use .env files

  return {
    plugins: [
      vue(),
      mkcert(),
      vike({
        // Disable automatic URL normalization.
        disableUrlNormalization: true,
      }),
    ],

    // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vite-plugin-ssr's CI
    optimizeDeps: { include: ['cross-fetch'] },

    resolve: {
      alias: {
        '#src': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // if to set custom server configuration, remove this if you are satisfied with the default settings
    server: {
      https: true,
      //host: 'localdev.com',
      //origin: 'https://localdev.com:3000',
      port: 3000,
      strictPort: true,
      // proxy: {
      //   '/EPiServer.Forms': {
      //     target: 'https://localdev.com',
      //     secure: false,
      //     changeOrigin: true,
      //   },
      // },
      // // this will give us permission to see images from the UI library
      // fs: {
      //   strict: false,
      // },
    },
  };
});
