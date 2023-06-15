declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<any, any, any>;
  export default component;
}

declare module 'iframe-resizer/js/iframeResizer.min.js';

interface String {
  toAbsoluteUrl(): string;
  toHypenCase(): string;
  replaceAll(pattern, replacement): string;
}

interface Array {
  first<Type>(): any;
  last<Type>(): Type;
  sortAlphabetically<Type>(
    property: (arg0: Type) => string,
    descending = false
  );
}

interface Window {
  CookieInformation: any;
  epi: any;
  jQuery: any;
  $: any;
  dataLayer: any;
  onYouTubeIframeAPIReady: any;
  lazySizesConfig: any;
  lazySizesDefaults: any;
  unity: Unity;
  require: any;
  grecaptcha: any;
  epi: any;
  google: any;
  GoogleTagManager: any;
  $$epiforms: any;
  sodraAppEnv: any;
  GTMFactory: any;
  angular: any;
  app: any;
}

interface Vue {
  $cookies;
}

interface Navigator {
  msSaveOrOpenBlob;
}

declare const sodraAppEnv: any;
declare const SodraEPiServerForms: any;
declare const epi: any;
declare const $$epiforms: any;
declare const grecaptcha: any;
declare const GoogleTagManager: any;
declare const $: any;
declare const decodeEntities: any;
declare const unity: any;
declare const YT: any;
declare const google: any;
declare const GTMFactory: any;
declare const pressReleaseSubscriptionForm: any;
declare const $i18n: any;
