import { fileURLToPath, URL } from 'url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
//import mkcert from 'vite-plugin-mkcert';
import vike from 'vike/plugin';

export default defineConfig(() => {
  return {
    plugins: [
      vue(),
      //mkcert(), // create a self-signed certificate
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
  };
});
