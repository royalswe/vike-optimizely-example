import { fileURLToPath, URL } from 'url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import mkcert from 'vite-plugin-mkcert';
import ssr from 'vite-plugin-ssr/plugin';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [vue(), ssr(), mkcert()],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    server: {
      https: true,
      host: 'localdev.com',
      origin: 'https://localdev.com:3000',
      port: 3000,
      strictPort: true,
      proxy: {
        '/EPiServer.Forms': {
          target: 'https://localdev.com',
          secure: false,
          changeOrigin: true,
        },
      },
      // this will give us permission to see images from the UI library
      fs: {
        strict: false,
      },
    },
  };
});
