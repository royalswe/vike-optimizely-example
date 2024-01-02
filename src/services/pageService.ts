import emailService from './emailService';
import httpService from './httpService';

export default new (class PageService {
  /**
   * Set site settings
   * @param pageId
   * @param commonStore
   * @returns
   */
  public async getSiteSettings(
    pageId: number,
    preview: boolean,
    language: string
  ): Promise<any> {
    try {
      const settingsProperties = [
        'LoginModalContentArea',
        'FooterCopy',
        'FooterColumnOne',
        'FooterColumnTwo',
        'FooterColumnThree',
        'FacebookLink',
        'InstagramLink',
        'TwitterLink',
        'YoutubeLink',
        'LinkedinLink',
        'SiteSearchPlaceholder',
        'SearchPage',
        'GdprLoginText',
        'GdprLoginLink',
        'Error404Page',
        'OldBrowserInformation',
        'StartPageSelectionList',
        'Popovers',
        'UseCognitiveSearch',
      ];
      const settingsPropertiesString =
        settingsProperties.join('&propertyNames=');

      const response: any = await httpService.get(
        `/_api/pages/getstartpageorsettingspageproperties/${
          pageId ?? import.meta.env.VITE_START_PAGE_ID
        }?epieditmode=${preview}&propertyNames=${settingsPropertiesString}`,
        {
          headers: {
            ...(language && { 'Accept-Language': language }),
          },
        }
      );

      const settings: any = {};
      for (const propertyName of settingsProperties) {
        const lowercasePropertyName =
          propertyName.charAt(0).toLowerCase() + propertyName.slice(1);

        let settingValue = response[lowercasePropertyName];

        // obfuscate emails
        if (settingValue) {
          settingValue = emailService.obfuscateEmailsFromText(
            JSON.stringify(settingValue)
          );
          settingValue = JSON.parse(settingValue);
        }

        settings[lowercasePropertyName] = settingValue;
      }

      return settings;
    } catch (error) {
      return Promise.reject(error);
    }
  }
})();
