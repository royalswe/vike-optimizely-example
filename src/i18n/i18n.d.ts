/* eslint-disable */
import { DefineLocaleMessage } from 'vue-i18n';
import type { MessageSchema } from '.';

declare module 'vue-i18n' {
  // define the locale messages schema
  export interface DefineLocaleMessage extends MessageSchema {}
}
