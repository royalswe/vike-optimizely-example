import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd()); // if you want to use .env files

  return {
    plugins: [vue(), ssr(), mkcert()], // remove mkcert() if you don't want to use https

    // We manually add a list of dependencies to be pre-bundled, in order to avoid a page reload at dev start which breaks vite-plugin-ssr's CI
    optimizeDeps: { include: ['cross-fetch'] },

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
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
