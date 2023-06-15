import httpService from '@/services/httpService';

export default new (class AccountService {
  /**
   *
   * @returns user
   */
  public getUser(language: string) {
    return httpService
      .get(`/_api/account`, {
        headers: {
          'Accept-Language': language ?? '',
        },
      })
      .then((response: any) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   *
   * @param startPageId
   * @returns user navigation pages
   */
  public getUserNavigation(startPageId: any, language: string): Promise<any> {
    return httpService
      .get(`/_api/account/usernavigation/${startPageId}`, {
        headers: {
          'Accept-Language': language ?? '',
        },
      })
      .then((response: any) => {
        return response;
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  }

  /**
   * User is editor or admin
   * @param commonStore
   * @returns
   */
  public isEditorOrAdmin(commonStore: any): boolean {
    return commonStore.user?.Groups?.some(
      (group: string) =>
        import.meta.env.VITE_ROLE_CMS_EDITORS?.indexOf(group) != -1 ||
        import.meta.env.VITE_ROLE_CMS_ADMINS?.indexOf(group) != -1
    );
  }
})();
