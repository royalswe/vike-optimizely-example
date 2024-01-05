// https://vike.dev/onBeforeRender
import type { PageContext } from '#src/renderer/types';

let pageHierarchyStore: any; // store the page hierarchy in memory

// Setter for page hierarchy
function setPageHierarchy(pageHierarchy: any) {
  pageHierarchyStore = pageHierarchy;
}

// Getter for page hierarchy
function getPageHierarchy() {
  return pageHierarchyStore;
}

/**
 * @param routeParams
 * @returns page hierarchy
 */
async function getRootMenuPage(pageContext: PageContext) {
  const pages = getPageHierarchy();
  const marketPage = pages.Children.find(
    (p: any) => p.Url === pageContext.market
  );

  const defaultMenuPage = {
    rootMenu: marketPage,
    marketPageId: marketPage?.Id,
    marketPagePath: marketPage?.UrlName,
  };

  if (pageContext.businessArea) {
    const startPage = findStartPage(
      marketPage,
      `${pageContext.market}${pageContext.businessArea}/`
    );

    return startPage?.BusinessAreaStartPage
      ? {
          rootMenu: startPage,
          marketPageId: marketPage?.Id,
          marketPagePath: marketPage?.UrlName,
        }
      : defaultMenuPage;
  }

  return defaultMenuPage;
}

/**
 * @param pageContext
 * @returns Page object with children
 */
async function getPageByPath(pageContext: PageContext) {
  const pages = getPageHierarchy();
  let currentPage = pages;
  let parentPage = null;

  const breadcrumb = []; // store the breadcrumb on the current page
  // Find page with short url
  if (
    pageContext.urlOriginal.split('?')[0] ===
    pageContext.urlWithoutMarketAndLocale
  ) {
    currentPage = findPageWithUrl(
      pageContext.urlWithoutMarketAndLocale.replaceAll('/', '').split('?')[0],
      currentPage
    );
  } else {
    // get all paths except market code in array and remove empty strings if exist
    const pathArray = pageContext.urlWithoutMarketAndLocale
      .split('/')
      .filter((str: string) => str !== '' && !str.startsWith('?')) // remove empty strings and query parameters
      .map((item) => item + '/');

    pathArray.unshift(pageContext.market); // add market code to the beginning of the array now because we don't want to split the /.
    let pathName = ''; // pathName is used to build the path to the page

    for (const urlName of pathArray) {
      pathName += urlName; // increment pathName with the current urlName
      const childPage = currentPage?.Children?.find(
        (child: { Url: string; ExternalUrl: string }) => {
          return child.Url.endsWith(`${pathName}`);
        }
      );

      parentPage = currentPage;
      currentPage = childPage;

      if (currentPage?.ShowInMenu) {
        breadcrumb.push({ title: currentPage.Name, path: pathName });
        currentPage.breadcrumb = breadcrumb;
      }
    }
  }

  return { currentPage, parentPage };
}

function findPageWithUrl(url: string, currentNode: any): any {
  url = url.replace('/', '');

  let i, currentChild, result;
  if (url == currentNode.UrlName) {
    return currentNode;
  } else {
    // Use a for loop instead of forEach to avoid nested functions
    // Otherwise "return" will not work properly
    for (i = 0; i < currentNode.Children?.length; i += 1) {
      currentChild = currentNode.Children[i];

      // Search in the current child
      result = findPageWithUrl(url, currentChild);
      // Return the result if the page has been found
      if (result) {
        return result;
      }
    }

    // The node has not been found and we have no more options
    return false;
  }
}

async function getPageByType(type: string, pages: Array<any>) {
  pages.forEach((page) => {
    if (page.PageTypeName === type) {
      return page.Url;
    } else if (page.Children) {
      return getPageByType(type, page.Children);
    }
  });
}
async function getPageById(id: number, pages: Array<any>): Promise<any> {
  let pageToReturn: any = undefined;

  if (pages) {
    for (const page of pages) {
      if (page.Id == id) {
        pageToReturn = page;
      } else if (!pageToReturn && page.Children && page.Children.length > 0) {
        const childResult = await getPageById(id, page.Children);
        if (childResult) {
          pageToReturn = childResult;
        }
      }
    }
  }

  return pageToReturn;
}

/**
 * Get page url by page type from router
 * @param pageTypeName
 * @returns
 */
async function getPageUrlByPageType(
  pageTypeName: string,
  pages: Array<any> | undefined
): Promise<any> {
  let pageUrl: string | undefined = undefined;
  if (pages) {
    for (const page of pages) {
      if (page.PageTypeName === pageTypeName) {
        pageUrl = page.UrlName;
      } else if (page.Children && page.Children.length > 0) {
        const childResult = await getPageUrlByPageType(
          pageTypeName,
          page.Children
        );
        if (childResult) {
          pageUrl = childResult;
        }
      }
    }
  }

  return pageUrl;
}

/**
 * @param page
 * @returns { object }
 * Find and return the first start page in the page hierarchy
 */
function findStartPage(page: any, path: string): any {
  const childPage = page.Children.find(
    (p: any) =>
      p.Url === path &&
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

export {
  setPageHierarchy,
  getPageByPath,
  getRootMenuPage,
  getPageByType,
  getPageById,
  getPageUrlByPageType,
};
