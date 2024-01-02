import httpService from '#src/services/httpService';

export default new (class AccountService {
  /**
   *
   * @param startPageId
   * @returns user navigation pages
   */
  public getUserNavigation(
    startPageId: number,
    language: string
  ): Promise<any> {
    return httpService
      .get(`/_api/account/usernavigation/${startPageId}`, {
        headers: {
          'Accept-Language': language ?? '',
        },
      })
      .then((response) => {
        return response;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }

  /**
   * User is editor or admin
   * @param commonStore
   * @returns
   */
  public isEditorOrAdmin(user: any): boolean {
    return user?.Groups?.some(
      (group: string) =>
        import.meta.env.VITE_ROLE_CMS_EDITORS?.indexOf(group) != -1 ||
        import.meta.env.VITE_ROLE_CMS_ADMINS?.indexOf(group) != -1
    );
  }
})();
