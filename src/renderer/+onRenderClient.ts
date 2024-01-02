/**
 * This file is executed in the browser only.
 */
import type { PageContext } from './types';
import { createApp } from './app';
import '#src/assets/main.scss';

import { App } from 'vue';
import lazyService from '#src/services/lazyService';

import { setPageMetaData } from './pageMetaData';
import { updateLanguage } from '#src/i18n';

import { addClickOutsideDirective } from '#src/directives/clickOutside.client';
import { addFallbackImageDirective } from '#src/directives/fallbackImage.client';

export default onRenderClient;
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

let app: App<Element> & { changePage: (pageContext: PageContext) => void };

async function onRenderClient(pageContext: PageContext) {
  if (!app) {
    const instance = createApp(pageContext);
    app = instance.app;
    app.mount('#application');
  } else {
    // Update language in i18n
    updateLanguage(pageContext.locale);
    // if app allready exists, just update pageContext
    app.changePage(pageContext);
  }

  if (pageContext?.documentProps?.customStyle) {
    addStyle('customStyle', pageContext.documentProps.customStyle);
  }

  // runs on hydration, meaning it will run on first page load
  if (pageContext.isHydration) {
    lazyService.addLazyBackgrounds();
    // Custom directives
    addClickOutsideDirective(app);
    addFallbackImageDirective(app);
    // if (cookieService.userConsentsToStatisticCookies()) {
    //   cookieService.setCookie(cookieName.VisitType, pageContext.visitType);
    // }
  } else {
    // runs on client side navigation
    //
    // Set lang attribute on html element
    document.documentElement.lang = pageContext.locale;
    // Get page meta data as string
    const pageMetaData = setPageMetaData(pageContext);
    removeMetaData();

    // Add new meta data
    textNodeInnerHTML(document.head.lastChild, pageMetaData);
  }
}

function addStyle(name: string, inlineStyle: string) {
  const existingTag = document.querySelector(`style[name=${name}]`);

  if (existingTag) {
    existingTag.remove();
  }
  // Add new inline style
  if (inlineStyle) {
    const style = document.createElement('style');
    style.setAttribute('name', name);
    style.innerHTML = inlineStyle;

    document.body.append(style);
  }
}

function getNextSiblings(element: HTMLElement, filter: Array<string>) {
  const sibs = [];
  while (element) {
    element = element.nextSibling as HTMLElement;
    if (element && filter.indexOf(element.nodeName) >= 0) {
      sibs.push(element);
    }
  }
  return sibs;
}

function textNodeInnerHTML(textNode: any, innerHTML: any) {
  const div = document.createElement('div');
  textNode.parentNode.insertBefore(div, textNode);
  div.insertAdjacentHTML('afterend', innerHTML);
  div.remove();
  textNode.remove();
}

function removeMetaData() {
  const metaDataStart = document.querySelector<HTMLElement>(
    'head meta[name="meta-start"]'
  );
  const metaDataElements = metaDataStart
    ? getNextSiblings(metaDataStart, ['TITLE', 'LINK', 'META'])
    : [];
  metaDataElements.forEach((element) => {
    element.remove();
  });
}
