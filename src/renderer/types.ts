export type { PageContextServer };
export type { PageContextClient };
export type { PageContext };
export type { PageProps };
export type { Component };
export type { PageContextUrl };

import type { SitePageData } from '#src/models/pages/sitePageData';
import type { SettingsPage } from '#src/models/pages/settingsPage';


import type {
  PageContextBuiltInServer,
  //*
  // When using Client Routing https://vite-plugin-ssr.com/clientRouting
  PageContextBuiltInClientWithClientRouting as PageContextBuiltInClient,
  /*/
  // When using Server Routing
  PageContextBuiltInClientWithServerRouting as PageContextBuiltInClient
  //*/
} from 'vike/types';
import type { ComponentPublicInstance, DefineComponent } from 'vue';

type Component = ComponentPublicInstance; // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086

type Page = Component;
type PageProps = Record<string, unknown>;

type PageContextCustom = {
  Page: Page;
  pageProps?: PageProps;
  config: {
    /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
    title?: string;
    Layout?: DefineComponent;
  };
  /** Title defined dynamically by onBeforeRender() */
  title?: string;
  locale: 'sv' | 'en' | 'da' | 'et' | 'lv';
  market: string;
  businessArea: string;
  fullUrl: string;
  urlWithoutMarketAndLocale: string;
  initialStoreState?: any;
  user: any;
  currentPage?: any;
  siteSettings: SettingsPage;
  documentProps: SitePageData;
  marketPageId: any;
  isPreview?: boolean;
  visitType?: string;
  isStyleApp?: boolean;
  requestCookie?: string;
  isHydration: boolean;
};

type PageContextUrl = {
  locale?: string;
  market?: string;
  urlWithoutMarketAndLocale?: string;
  fullUrl: string;
  routeParams?: { language: string; businessArea: string };
  initialStoreState?: any;
};

type PageContextServer = PageContextBuiltInServer<Page> & PageContextCustom;
type PageContextClient = PageContextBuiltInClient<Page> & PageContextCustom;

type PageContext = PageContextClient | PageContextServer;
