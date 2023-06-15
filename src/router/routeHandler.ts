// https://vite-plugin-ssr.com/onBeforeRender
import type { PageContext } from '@/renderer/types';
import contentService from '@/services/contentService';
import { RenderErrorPage } from 'vite-plugin-ssr/RenderErrorPage';

async function modifyMenuItems(items: any[], parentUrlName = '') {
  await Promise.all(
    items.map(async (item) => {
      const { Children } = item;

      if (parentUrlName) {
        item.UrlName = `${parentUrlName}/${item.UrlName}`;
      }

      if (Children.length > 0) {
        await modifyMenuItems(Children, item.UrlName);
      }
    })
  );
}

let pageHierarchyStore: any; // store the page hierarchy in memory
let dateOnHierarchyStore: any; // Initialize the last run time as null initially
/**
 *
 * @returns fetch new page hierarchy from optimizely server
 */
async function initPageHierarchy() {
  if (
    !pageHierarchyStore ||
    Date.now() - dateOnHierarchyStore >= 30 * 60 * 1000 // fetch new hierarchy if it's more than 30 minutes old
  ) {
    console.log('fetch new page hierarchy from optimizely server');
    try {
      const response = await contentService.getPageHierarchy();
      pageHierarchyStore = response;

      pageHierarchyStore.Children.map(async (child: any) => {
        if (
          child.PageTypeName !== 'ErrorPage' &&
          child.UrlName &&
          child.Language
        ) {
          child.UrlName = `/${child.Language}/${child.UrlName}`;
        }
      });

      await modifyMenuItems(pageHierarchyStore.Children);

      dateOnHierarchyStore = Date.now();
    } catch (error) {
      const errorInfo = `Could not fetch page hierarchy error: ${error}`;
      throw RenderErrorPage({
        pageContext: { is404: false, pageProps: { errorInfo } },
      });
    }
  }

  return pageHierarchyStore;
}

/**
 *
 * @param routeParams
 * @returns page hierarchy
 */
async function getRootMenuPage(pageContext: PageContext) {
  const pages = await initPageHierarchy();

  const startMenu = pages.Children.find(
    (p: any) => p.UrlName === pageContext.market
  );

  if (pageContext.businessArea) {    
    const marketPage = await findStartPage(
      startMenu,
      `${pageContext.market}/${pageContext.businessArea}`
    );

    const marketPageId = marketPage ? marketPage.Id : null;
    const marketPagePath = marketPage ? marketPage.UrlName : null;
    return { rootMenu: marketPage, marketPageId, marketPagePath };
  }

  return { rootMenu: startMenu, marketPageId: null, marketPagePath: null };
}

/**
 * @param obj
 * @param path
 * @returns Page object with children
 */
async function getPageByPath(pageContext: PageContext) {
  // TODO: urlWithoutLocale adds index.pageContext.json on client routing
  let currentPage = await initPageHierarchy();
  const breadcrumb = []; // store the breadcrumb on the current page

  // get all paths except market code in array and remove empty strings if exist
  const pathArray = pageContext.urlWithoutLocale
    .split('/')
    .filter((str: string) => str !== '') // remove empty strings
    .map((item) => '/' + item);

  pathArray.unshift(pageContext.market); // add market code to the beginning of the array now because we don't want to split the /.

  let pathName = ''; // pathName is used to build the path to the page

  for (const urlName of pathArray) {
    pathName += urlName; // increment pathName with the current urlName

    currentPage = currentPage.Children.find(
      (child: { UrlName: string }) => child.UrlName === pathName
    );

    breadcrumb.push({ title: currentPage.Name, path: pathName });

    if (!currentPage) {
      // 404 page
      const errorInfo = `Could not find: ${urlName}.`;
      throw RenderErrorPage({ pageContext: { pageProps: { errorInfo } } });
    }
  }
  currentPage.breadcrumb = breadcrumb;

  return currentPage;
}

export async function getContactUsPage(
  id: number,
  market: string
): Promise<any> {
  let pages = await initPageHierarchy();

  // Start from the market page instead of root
  pages = pages.Children.find((p: any) => p.UrlName === market);

  const foundPage = findPageById(Number(id), pages);
  // handle 404 on client side
  return foundPage;
}

export async function findPageById(id: number, pages: object): Promise<any> {
  if (pages && pages.Id === id) {
    return pages;
  }

  for (const key in pages) {
    if (typeof pages[key] === 'object' && pages[key] !== null) {
      const result = await findPageById(id, pages[key]);

      if (result) {
        return result;
      }
    }
  }

  return null;
}

/**
 * @param page
 * @returns { object }
 * Find and return the first start page in the page hierarchy
 */
function findStartPage(page: any, path: string): any {
  const childPage = page.Children.find(
    (p: any) =>
      p.UrlName === path &&
      (p.BusinessAreaStartPage === true ||
        p.PageTypeName === 'FlexStartPage') &&
      p.ShowInMenu
  );

  if (childPage) {
    return childPage;
  }

  for (const child of page.Children) {
    const startPage = findStartPage(child, path);
    if (startPage) {
      return startPage;
    }
  }

  return null;
}

export { initPageHierarchy, getPageByPath, getRootMenuPage };
