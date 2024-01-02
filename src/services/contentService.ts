import type { PageContext } from '#src/renderer/types';
import httpService from '#src/services/httpService';
import emailService from './emailService';

interface ContentOptions {
  pageUrl?: string;
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
    language?: PageContext['locale'],
    options: ContentOptions = {},
    cookie?: string
  ): Promise<any> {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(options)) {
      params.append(key, value as string);
    }

    return httpService
      .get(`/api/episerver/v2.0/content/${id}?` + params.toString(), {
        headers: {
          ...(language && { 'Accept-Language': language }),
          ...(cookie && { Cookie: cookie }),
        },
      })
      .then((response) => {
        // obfuscate emails and return response
        return JSON.parse(
          emailService.obfuscateEmailsFromText(JSON.stringify(response))
        );
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
            ...(language && { 'Accept-Language': language }),
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
}

const contentService: ContentService = new ContentService();

export default contentService;
