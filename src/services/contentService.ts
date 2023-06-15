import httpService from '@/services/httpService';

interface ContentOptions {
  PageUrl?: string;
  expand?: string;
  language?: string;
  epiEditMode?: boolean;
}

const startPageId = import.meta.env.VITE_START_PAGE_ID;

class ContentService {
  /**
   * Get content
   * @param id
   * @param options
   * @returns
   */
  public getContent(
    id = startPageId,
    options: ContentOptions = {}
  ): Promise<any> {
    const {
      PageUrl = '',
      expand = '',
      language = '',
      epiEditMode = false,
    } = options;

    return httpService
      .get(
        `/api/episerver/v2.0/content/${id}?epieditmode=${epiEditMode}&expand=${expand}&currentPageUrl=${PageUrl}`,
        {
          headers: {
            'Accept-Language': language,
          },
        }
      )
      .then((response) => {
        // obfuscate emails and return response
        return JSON.parse(JSON.stringify(response));
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Get children
   * @param id
   * @param options
   * @returns
   */
  public getChildren(
    id = startPageId,
    options: ContentOptions = {}
  ): Promise<any> {
    const { expand = '', language = '', epiEditMode = false } = options;
    return httpService
      .get(
        `/api/episerver/v2.0/content/${id}/children?epieditmode=${epiEditMode}&expand=${expand}`,
        {
          headers: {
            'Accept-Language': language,
          },
        }
      )
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * Get page hiearchy
   * @param epiEditMode
   * @returns
   * TODO getpagehiearchy in get is spelled wrong
   */
  public getPageHierarchy(epiEditMode = false): Promise<any> {
    return httpService
      .get(`/_api/pages/getpagehiearchy?isPreview=${epiEditMode}`, {
        headers: {
          'Accept-Language': 'sv',
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
}

const contentService: ContentService = new ContentService();

export default contentService;
