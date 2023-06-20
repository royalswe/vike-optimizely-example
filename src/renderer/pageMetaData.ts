import { dangerouslySkipEscape } from 'vite-plugin-ssr/server';
import { PageContext } from './types';

/**
 * Set page meta data from documentProps fetched from api
 * @param page
 */
export function setPageMetaData(pageContext: PageContext) {
  if (!pageContext.documentProps) {
    return '';
  }
  const page: any = pageContext.documentProps;
  const title =
    page?.metaTitle ||
    page?.title ||
    page?.heading ||
    page?.header ||
    page?.name ||
    '';

  let metaData = '';

  // Set rss link only for thoose pages who has rss content
  if (
    ['EventListPage', 'NewsListPage', 'PressReleasesPage'].includes(
      page?.pageType || page?.contentType?.last() // TODO do page.pageType exist?
    )
  ) {
    metaData += `<link href="${pageContext.fullUrl}rss" rel="alternate" title="${page?.rSSTitle}" type="application/rss+xml">`;
  }

  // TODO: do not think title should every where
  const metaArray = [
    ['robots', page?.includeInSearch ? 'noindex' : false],
    ['title', title],
    ['description', page?.metaDescription],
    ['keywords', page?.metaKeywords],
    ['author', page?.metaAuthor],
    ['og:url', page?.url],
    ['og:type', 'website'],
    ['og:title', title],
    ['og:description', title],
    ['og:image', page?.imageUrl],
    ['twitter:url', page?.imageUrl],
    ['twitter:card', 'summary'],
    ['twitter:title', title],
    ['twitter:description', title],
    ['twitter:image', page?.imageUrl],
  ];

  for (const [key, value] of metaArray) {
    if (value !== undefined && value !== '') {
      metaData += `<meta name="${key}" content="${value}" />`;
    }
  }

  // TODO: verify canonical/alternative links
  if (page?.alternateLinks?.length) {
    // sourceUrl is the canonical
    if (page.alternateLinks[0]?.sourceUrl) {
      metaData += `<link rel="canonical" href="${page.alternateLinks[0].sourceUrl}" />`;
    }
    page.alternateLinks.forEach((alternateLink: any) => {
      // Make all links alternative except the current page
      if (page.contentLink.id != page.alternateLink.pageId) {
        metaData += `<link rel="alternate" href="${alternateLink.url}" hreflang="${alternateLink.language}" />`;
      }
    });
  }

  return dangerouslySkipEscape(`
    <title>${title}</title>
    ${metaData}
    `);
}
