/**
 * This file is runned on the server only.
 */
import type { PageContext } from './types';

import { renderToNodeStream } from 'vue/server-renderer';
import { escapeInject } from 'vike/server';
import { createApp } from './app';
import { setPageMetaData } from './pageMetaData';
import { dangerouslySkipEscape } from 'vike/server';

async function onRenderHtml(pageContext: PageContext) {
  const instance = createApp(pageContext) ?? '';
  const stream = renderToNodeStream(instance.app) ?? '';
  const metaData = dangerouslySkipEscape(setPageMetaData(pageContext)) ?? '';
  const lazyScript = dangerouslySkipEscape(`<script>
    window.lazySizesConfig = window.lazySizesConfig || {};
    window.lazySizesConfig.srcAttr = 'data-lazy-src';
    window.lazySizesConfig.srcsetAttr = 'data-lazy-srcset';
    window.lazySizesConfig.sizesAttr = 'data-lazy-sizes';

    window.lazySizesConfig.requireJs = function (modules, cb) {
      window.require(modules, cb);
    };
    </script>`);

  const cookieConsentScript =
    dangerouslySkipEscape(`<script id="CookieConsent" src="https://policy.app.cookieinformation.com/uc.js" data-culture="${pageContext.locale}"
  type="text/javascript">
  </script>`);

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${pageContext.locale}">
      <head>
      ${lazyScript}
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
      <link rel="icon" href="/static/img/favicon.svg" />
      ${cookieConsentScript}
      <meta name="meta-start" />
      ${metaData}
      <script src="https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY
      }"></script>
      <script>
          (function (w, d, s, l, i) {
              w[l] = w[l] || []; w[l].push({
                  'gtm.start':
                      new Date().getTime(), event: 'gtm.js'
              }); var f = d.getElementsByTagName(s)[0],
                  j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : ''; j.async = true; j.src =
                      'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
          })(window, document, 'script', 'dataLayer', '${
            import.meta.env.VITE_GTM_ID
          }');
        </script>
      </head>
      <body>
      <!-- Google Tag Manager (noscript) -->
      <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=${
            import.meta.env.VITE_GTM_ID
          }"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe>
      </noscript>
      <!-- End Google Tag Manager (noscript) -->
        <noscript>
          <div class="c-alert c-alert--attention">
            <h2>Enable JavaScript for better experience.</h2>
          </div>
        </noscript>
        <div id="application">${stream}</div>
      </body>
    </html>`;

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true, // starts writing the HTML template right away before the page is loaded
    },
  };
}

export default onRenderHtml;
