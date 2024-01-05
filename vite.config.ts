import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import vike from 'vike/plugin';

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      mkcert(), // create a self-signed certificate
      vike({
        // Disable automatic URL normalization.
        disableUrlNormalization: true,
      }),
    ],

    resolve: {
      alias: {
        '#src': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // if to set custom server configuration, remove this if you are satisfied with the default settings
    server: {
      //https: true,
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
