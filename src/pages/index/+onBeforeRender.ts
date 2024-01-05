async function onBeforeRender() {
  return {
    pageContext: {
      pageProps: {
        marketPages: [
          { name: 'Sweden', url: '/sv/se/' },
          { name: 'Great Britain', url: '/en/gb/' },
          { name: 'Global', url: '/en/global/' },
        ],
      },
      documentProps: {
        title: 'meta title',
        metaDescription: 'meta description.',
        metaKeywords: 'ssr, spa, vite, vue',
      },
    },
  };
}

export default onBeforeRender;
