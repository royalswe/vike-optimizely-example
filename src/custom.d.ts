declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<any, any, any>;
  export default component;
}

declare module 'vue-i18n';

interface String {
  toAbsoluteUrl(): string;
  toHypenCase(): string;
  replaceAll(pattern, replacement): string;
}

interface Array {
  first(): any;
  last<Type>(): Type;
  sortAlphabetically<Type>(
    property: (arg0: Type) => string,
    descending = false
  );
}

interface Window {
  epi: any;
  lazySizesConfig: any;
  lazySizesDefaults: any;
  require: any;
  grecaptcha: any;
  $$epiforms: any;
  sodraAppEnv: any;
  GTMFactory: any;
  app: any;
}

interface Navigator {
  msSaveOrOpenBlob;
}

declare const epi: any;
declare const $$epiforms: any;
declare const grecaptcha: any;
declare const GoogleTagManager: any;
declare const decodeEntities: any;
declare const google: any;
declare const $i18n: any;
