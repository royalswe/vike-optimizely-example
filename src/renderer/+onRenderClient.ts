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
    instance.store.state.value = pageContext.initialStoreState; // pinia
    app.mount('#application')
  } else {
    // if app allready exists, just update pageContext
    app.changePage(pageContext)
  }

  // add custom css from the CMS
  if (pageContext.documentProps?.customStyle) {
    addStyle('customStyle', pageContext.documentProps.customStyle);
  }

}

function addStyle(name: string, inlineStyle: string) {
  const existingTag = document.querySelector(`style[name=${name}]`);

  // Add new style
  if (existingTag) {
    existingTag.remove();
  }

  if (inlineStyle) {
    const style = document.createElement('style');
    style.setAttribute('name', name);
    style.innerHTML = inlineStyle;
    document.head.append(style);
  }
}