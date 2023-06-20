/**
 * This file is executed in the browser only.
 */
import type { PageContext } from './types'

import { createApp } from './app'
import '@sodraskog/unity/sass/unity.scss';
import '@/assets/main.scss';

export default onRenderClient

let app: any// ReturnType<typeof createApp>
async function onRenderClient(pageContext: PageContext) {

  if (!app) {
    const instance = createApp(pageContext)
    app = instance.app
    app.mount('#application')
  } else {
    // if app allready exists, just update pageContext
    app.changePage(pageContext)
  }

}