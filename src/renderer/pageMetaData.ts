import { PageContext } from './types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CONTENT_TYPES_WITH_RSS = [
  'EventListPage',
  'NewsListPage',
  'PressReleasesPage',
];

export function setPageMetaData(pageContext: PageContext): string {
  if (!pageContext.documentProps) {
    return '';
  }

  const page: any = pageContext.currentPage?.PressRelease
    ? { name: pageContext.currentPage.PressRelease.title }
    : pageContext.documentProps;

  const title =
    page?.metaTitle ||
    page?.title ||
    page?.heading ||
    page?.header ||
    page?.name ||
    '';

  let metaData = generateRSSLinks(page, pageContext);
  metaData += generateMetaTags(page, title);
  metaData += generateCanonicalLink(page);
  metaData += generateAlternateLinks(page);

  return `<title>${title}</title>\n${metaData}`;
}

function generateRSSLinks(page: any, pageContext: PageContext): string {
  if (CONTENT_TYPES_WITH_RSS.includes(page?.contentType?.last())) {
    return `<link href="${pageContext.fullUrl}rss" rel="alternate" title="${page?.rSSTitle}" type="application/rss+xml">`;
  }
  return '';
}

function generateMetaTags(page: any, title: string): string {
  const imageUrl = `${BASE_URL}${page?.openGraphImageNewFotoware?.url}`;
  const pageUrl = `${BASE_URL}${page?.url}`;

  const metaArray = [
    ['robots', page?.includeInSearch ? 'noindex' : undefined],
    ['title', title],
    ['description', page?.metaDescription],
    ['keywords', page?.metaKeywords],
    ['author', page?.metaAuthor],
    ['og:url', pageUrl],
    ['og:type', 'website'],
    ['og:title', title],
    ['og:description', page?.metaDescription],
    ['og:image', imageUrl],
    ['twitter:url', pageUrl],
    ['twitter:card', 'summary'],
    ['twitter:title', title],
    ['twitter:description', page?.metaDescription],
    ['twitter:image', imageUrl],
  ];

  return metaArray
    .map(([key, value]) => generateMetaTag(key, value))
    .join('\n');
}

function generateMetaTag(name: string, content: string): string {
  return content ? `<meta name="${name}" content="${content}" />` : '';
}

function replaceAllBaseUrl(input: string | undefined): string {
  if (!input) {
    return '';
  }
  return input.replaceAll(API_BASE_URL, BASE_URL);
}

function generateCanonicalLink(page: any): string {
  const canonical = page.metaCanonicalLink
    ? replaceAllBaseUrl(page.metaCanonicalLink)
    : undefined;
  return canonical ? `<link rel="canonical" href="${canonical}" />` : '';
}

function generateAlternateLinks(page: any): string {
  const alternateLinks = page.metaStartPageAlternateLinks
    ? replaceAllBaseUrl(page.metaStartPageAlternateLinks)
    : replaceAllBaseUrl(page.metaAlternateLinks);

  return alternateLinks || '';
}
