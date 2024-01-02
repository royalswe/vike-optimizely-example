export default function route(pageContext: { urlPathname: string }) {
  // If it is market page
  if (
    pageContext.urlPathname === '/' ||
    pageContext.urlPathname === '/location' ||
    pageContext.urlPathname === '/location/'
  ) {
    return true;
  }
  return false;
}
