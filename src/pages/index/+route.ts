export default function route(pageContext: { urlPathname: string }) {
  // If the path is market then go to start page
  if (
    pageContext.urlPathname === '/' ||
    pageContext.urlPathname === '/market'
  ) {
    return true;
  }
  return false;
}
