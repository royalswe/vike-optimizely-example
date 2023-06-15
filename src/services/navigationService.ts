import SidebarNavItem from '@sodraskog/unity/models/SidebarNavItem';

export default new (class NavigationService {
  /**
   * Map to menu item
   * @param pages
   * @returns
   */
  public MapPageToMenuItem = (pages: any[]): SidebarNavItem[] => {
    const items: SidebarNavItem[] = [];

    if (pages) {
      pages.forEach((page) => {
        if (page.ShowInMenu) {
          const childPagesInMenu = page.Children.filter(
            (c: any) => c.ShowInMenu
          );

          // Add menu item
          items.push(
            new SidebarNavItem({
              //route: page.Id + page.Language,
              href: page.UrlName,
              text: page.Name,
              showArrow: page.BusinessAreaStartPage,
              children:
                !page.BusinessAreaStartPage &&
                childPagesInMenu &&
                childPagesInMenu.length > 0
                  ? this.MapPageToMenuItem(childPagesInMenu)
                  : null,
            })
          );
        }
      });
    }
    return items;
  };

  /**
   * Map to menu item
   * @param navItems
   * @param lang
   * @returns
   */
  public MapNavItemToMenuItem = (navItems: any[]): SidebarNavItem[] => {
    const items: SidebarNavItem[] = [];

    if (navItems) {
      navItems.forEach((navItem) => {
        // Add menu item
        items.push(
          new SidebarNavItem({
            route: '',
            url: navItem.AvailableLanguages
              ? navItem.AvailableLanguages[0].Url
              : null,
            text: navItem.DisplayName,
            showArrow: navItem.Children?.length,
            children: navItem.Children,
          })
        );
      });
    }
    return items;
  };
})();
