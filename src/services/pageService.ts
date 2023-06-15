import httpService from './httpService';

export default new (class PageService {
  /**
   * Set site settings
   * @param pageId
   * @param commonStore
   * @returns
   */
  public async setSiteSettings(pageId: number, commonStore: any): Promise<any> {
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
        'DownloadMultipleFiles',
        'SearchPage',
        'GDPRLoginText',
        'GDPRLoginLink',
        'Error404Page',
        'OldBrowserInformation',
        'StartPageSelectionList',
        'Popovers',
      ];

      const settingsPropertiesString = settingsProperties.join(
        '&propertyNames='
      );
      const response = await httpService.get(
        `/_api/pages/getstartpageorsettingspageproperties/${pageId}?epieditmode=${commonStore.preview}&propertyNames=${settingsPropertiesString}`
      );

      const settings: any = {};
      for (const propertyName of settingsProperties) {
        const lowercasePropertyName =
          propertyName.charAt(0).toLowerCase() + propertyName.slice(1);

        const settingValue = response[lowercasePropertyName];
        settings[lowercasePropertyName] = settingValue;
      }

      commonStore.setSiteSettings(settings);
      return settings;
    } catch (error) {
      return Promise.reject(error);
    }
  }
})();
