// This file runs on client and server. Vike will probably change .server files to be server only in the future.
import httpService from '#src/services/httpService';
import pageService from '#src/services/pageService';
import { render } from 'vike/abort';

/**
 * @returns fetch new page hierarchy from optimizely server
 */
export async function fetchPageHierarchy(language: string, isPreview = false) {
  try {
    const languageHeader = language ? { 'Accept-Language': language } : {};
    const pageHiearchy = await httpService
      .get(`/_api/pages/getpagehiearchy?isPreview=${isPreview}`, {
        headers: {
          'Api-Key': import.meta.env.OPTIMIZELY_API_KEY,
          ...languageHeader,
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
    return pageHiearchy;
  } catch (error) {
    const siteSettings = await pageService.getSiteSettings(
      import.meta.env.VITE_START_PAGE_ID,
      false,
      language
    );

    throw render(500, {
      errorText: `Could not fetch page hierarchy error: ${error}`,
      siteSettings,
    });
  }
}
