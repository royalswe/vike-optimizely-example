import type { PageContext } from './types';

import { createSSRApp, defineComponent, h, markRaw, reactive } from 'vue';
import { createPinia } from 'pinia';
import i18n from '#src/i18n';
import { initFlashMessage } from '#src/models/flashMessage';
import LayoutDefault from './LayoutDefault.vue';
import { setPageContext } from './usePageContext';
import '#src/extensions/arrayExtensions';
import '#src/extensions/stringExtensions';

/**
 * Create a Vue App instance for the given `pageContext`.
 */
function createApp(pageContext: PageContext) {
  const { Page } = pageContext;

  const rootComponent = reactive({
    Page: markRaw(Page),
    pageProps: markRaw(pageContext.pageProps || {}),
    Layout: markRaw(pageContext.config.Layout || LayoutDefault),
  });

  const PageWithWrapper = defineComponent({
    setup() {
      rootComponent;
      return () => {
        return h(
          rootComponent.Layout,
          {},
          {
            default: () => {
              return h(rootComponent.Page, rootComponent.pageProps);
            },
          }
        );
      };
    },
  });

  const app = createSSRApp(PageWithWrapper);

  // We use `app.changePage()` to do Client Routing, see `+onRenderClient.ts`
  objectAssign(app, {
    changePage: (pageContext: PageContext) => {
      Object.assign(pageContextReactive, pageContext);
      rootComponent.Page = markRaw(pageContext.Page);
      rootComponent.pageProps = markRaw(pageContext.pageProps || {});
      rootComponent.Layout = markRaw(
        pageContext.config.Layout || LayoutDefault
      );
    },
  });

  // Make `pageContext` accessible from any Vue component, and make it reactive
  const pageContextReactive = reactive(pageContext);
  setPageContext(app, pageContextReactive);

  // Install Pinia
  const store = createPinia();
  app.use(store);
  // Install i18n with current page language`
  app.use(i18n(pageContext.locale));
  // Initialize flash message with default values
  app.provide('$flashMessage', reactive(initFlashMessage()));

  return { app, store };
}

// Same as `Object.assign()` but with type inference
function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum);
}

export { createApp };
