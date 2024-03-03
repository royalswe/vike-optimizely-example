export { route };

import type { RouteSync } from 'vike/types';

const route: RouteSync = (pageContext): ReturnType<RouteSync> => {
  // If it is market page
  if (
    pageContext.urlPathname === '/' ||
    pageContext.urlPathname === '/location' ||
    pageContext.urlPathname === '/location/'
  ) {
    return true;
  }
  return false;
};
