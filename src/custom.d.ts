declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<any, any, any>;
  export default component;
}
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

declare const $i18n: any;
