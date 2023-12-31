import { mapUrlParams } from '#src/composable/mapUrlParams';
import { isClientSide } from '#src/utils/ssrUtils';

export default new (class UrlService {
  /**
   * Get Facebook share url
   * @param url
   * @returns
   */
  public getFacebookShareUrl(url: string): string {
    return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }

  /**
   * Get Linked in share url
   * @param url
   * @returns
   */
  public getLinkedInShareUrl(url: string): string {
    return `https://www.linkedin.com/shareArticle?mini=true&url=${url}`;
  }

  /**
   * Get Twitter share url
   * @param url
   * @returns
   */
  public getTwitterShareUrl(url: string): string {
    return `https://twitter.com/intent/tweet?text=${url}`;
  }

  /**
   * Get last segment in url
   * @param url
   * @returns last segment in a url without slashes
   */
  public getLastSegmentInURL(url: string | null): string {
    if (url == null) {
      return 'Empty url';
    }
    url = url.replace(/^\/|\/$/g, '');
    return url.substring(url.lastIndexOf('/') + 1);
  }

  /**
   * Get first segment in url path
   * @param urlPath
   * @returns last segment in a url without slashes
   */
  public getFirstSegmentInURL(urlPath: string): string | undefined {
    const language = urlPath.split('/')[1];

    if (language?.length <= 2) {
      return urlPath.split('/')[1];
    }
    return undefined;
  }

  /**
   * Is url absolute
   * @param url
   * @returns
   */
  public isUrlAbsolute(url: string): boolean {
    return url.indexOf('://') > 0 || url.indexOf('//') === 0;
  }

  /**
   * Get url param
   * @returns {string} Fetch parameters from url and store them in object
   */
  public getUrlParam(key: string): string {
    return this.getUrlParams()[key] as string;
  }

  /**
   * Get url params
   * @returns {object} Fetch parameters from url and store them in object
   */
  public getUrlParams(): { [key: string]: string | string[] } {
    // get the parameters from url, need decodeURI because we have parameters with swedish characters
    if (isClientSide()) {
      const urlParams = decodeURI(window.location.search);

      const map: { [key: string]: any } = {};

      urlParams.replace(
        /([^&|?=]+)=?([^&]*)(?:&+|$)/g,
        (_match: string, key: string, value: string): any => {
          value = value?.replace(/\+/g, ' ');
          if (key in map) {
            // Store values in array if they are more than one item
            if (!Array.isArray(map[key])) {
              map[key] = [map[key]];
            }

            // push the new value into the array
            map[key].push(value);
          } else {
            // put the value into the map
            map[key] = value;
          }
        }
      );
      return map;
    }

    return {};
  }

  /**
   * Get url path from absolute url
   * @param url
   * @returns
   */
  public getPathFromAbsoluteUrl(url: string) {
    return this.isUrlAbsolute(url) ? new URL(url).pathname : url;
  }
  /**
   * Get language from url
   * @param url
   * @returns
   */
  public getLanguageFromUrl(): string {
    return (
      this.getFirstSegmentInURL(window.location.pathname) ||
      navigator?.language?.slice(0, 2) ||
      'en'
    );
  }
  /**
   * Set url params, will replace url parameters with new ones.
   * @param {Object} params
   */
  public setUrlParams(
    params: { key: string; value: string | string[] }[]
  ): void {
    const url = new URL(window.location.href);
    const query = new URLSearchParams(window.location.search);
    params.forEach((param) => {
      // if (!param.value) {
      //   return console.error('Param values is empty');
      // }
      const key = mapUrlParams(param.key, true);

      // Delete old param
      query.delete(key);
      const values: string[] | string = param.value;
      if (!key || typeof key !== 'string') {
        console.error(`${key} are not type of string`);
      }

      if (values && !Array.isArray(values)) {
        if (query.has(key)) {
          query.set(key, values);
        } else {
          return query.append(key, values);
        }
      } else if (values) {
        for (let i = 0; i < values.length; i++) {
          query.append(key, values[i]);
        }
      }
    });

    const queryString = query.toString();

    // replce url with new one
    window.history.replaceState(
      '',
      '',
      queryString
        ? `${url.origin}${url.pathname}?${query.toString()}`
        : `${url.origin}${url.pathname}`
    );
  }

  public extractUrlSegments(
    url: string
  ): {
    locale: string;
    market: string;
    urlWithoutMarketAndLocale: string;
    businessArea: string;
  } {
    url = `${url.replace(/\/$/, '')}/`;

    // Default values
    let locale = '';
    let market = '';
    let urlWithoutMarketAndLocale = url;
    let businessArea = '';

    const resolvedMarket = this.resolveMarket(url);
    if (resolvedMarket) {
      market = resolvedMarket;
      locale = this.resolveLocale(url) ?? locale;

      urlWithoutMarketAndLocale = urlWithoutMarketAndLocale
        .replace(market, '') // Remove market from url
        .replace('index.pageContext.json', ''); // remove index.pageContext.json from url, the string ads always when client rendering
      businessArea = urlWithoutMarketAndLocale.split('/')[0]; // get business area from url if exist
    }

    return {
      locale,
      market,
      urlWithoutMarketAndLocale,
      businessArea,
    };
  }

  private resolveMarket(urlPath: string): string | null {
    // Match market part of url (e.g. /sv/se/ of /sv/se/startpage)
    const matchMarketArr = urlPath.match(/^\/([a-zA-Z]{2}\/[^/]+)\//);
    return matchMarketArr && matchMarketArr[0];
  }

  private resolveLocale(urlPath: string): string | null {
    // Match locale part of url path (e.g. /sv/ of /sv/se/startpage)
    const matchLocaleArr = urlPath.match(/^\/([a-zA-Z]{2})\//);
    return matchLocaleArr && matchLocaleArr[1];
  }
})();
