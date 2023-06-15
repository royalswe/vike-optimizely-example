// Hook `usePageContext()` to make `pageContext` available from any Vue component.
// See https://vite-plugin-ssr.com/pageContext-anywhere

import type { App } from 'vue'
import type { PageContext } from './types'
import { inject } from 'vue'

export { usePageContext }
export { setPageContext }

const key = Symbol()

function usePageContext() : PageContext {
  const pageContext = inject(key)
  return pageContext as PageContext
}

function setPageContext(app: App, pageContext: PageContext) {
  app.provide(key, pageContext)
}
