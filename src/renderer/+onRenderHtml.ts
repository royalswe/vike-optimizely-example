/**
 * This file is runned on the server only.
 */
import type { PageContext } from './types'
import type { PageContextBuiltIn } from 'vite-plugin-ssr/types'

import { renderToNodeStream } from '@vue/server-renderer'
import { escapeInject } from 'vite-plugin-ssr/server'
import { createApp } from './app'
import {setPageMetaData} from './pageMetaData'

async function onRenderHtml(pageContext: PageContextBuiltIn & PageContext) {  
  const instance = createApp(pageContext)
  const stream = renderToNodeStream(instance.app)
  const metaData = setPageMetaData(pageContext) || '';

  const documentHtml = escapeInject`<!DOCTYPE html>
    <html lang="${pageContext?.documentProps?.language?.name || 'sv'}">
      <head>
      ${metaData}
      </head>
      <body>
        <div id="application">${stream}</div>
      </body>
    </html>`

  return {
    documentHtml,
    pageContext: {
      enableEagerStreaming: true // starts writing the HTML template right away before the page is loaded
    }
  }
}

export default onRenderHtml