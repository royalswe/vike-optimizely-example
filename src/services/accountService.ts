export default new (class AccountService {
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
