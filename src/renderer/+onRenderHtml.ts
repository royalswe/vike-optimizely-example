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
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      ${metaData}
      <script src="https://www.google.com/recaptcha/api.js?render=${
        import.meta.env.VITE_GOOGLE_RECAPTCHA_V3_SITE_KEY
      }"></script>
      </head>
      <body>
        <noscript>
          <div class="alert alert-warning">
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
