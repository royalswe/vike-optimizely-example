import { navigate } from 'vike/client/router';

export default new (class NavigationService {
  /**
   * Map to menu item
   * @param pages
   * @returns
   */
  public MapPageToMenuItem = (pages: any[]) => {
    const items: any = [];

    if (pages) {
      pages.forEach((page) => {
        if (page.ShowInMenu) {
          const childPagesInMenu = page.Children.filter(
            (c: any) => c.ShowInMenu
          );
          // Add menu item
          items.push({
            //route: page.Id + page.Language,
            url: page.Url,
            text: page.Name,
            showArrow: !!page.BusinessAreaStartPage,
            children:
              !page.BusinessAreaStartPage &&
              childPagesInMenu &&
              childPagesInMenu.length > 0
                ? this.MapPageToMenuItem(childPagesInMenu)
                : undefined,
          });
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
  public MapNavItemToMenuItem = (navItems: any[]) => {
    const items: any = [];

    if (navItems) {
      navItems.forEach((navItem) => {
        // Add menu item
        items.push({
          url: navItem.AvailableLanguages
            ? navItem.AvailableLanguages[0].Url
            : null,
          text: navItem.DisplayName,
          showArrow: !!navItem.Children?.length,
          children: navItem.Children,
        });
      });
    }
    return items;
  };

  /**
   * Convert all anchor links to router link
   */
  public setAnchorsToRouterLink() {
    const anchors = document.querySelectorAll<HTMLAnchorElement>(
      'main a:not(.router-link):not(.skip-router-link)'
    );
    for (const anchor of anchors) {
      const url = anchor.getAttribute('href') ?? '';
      if (
        (url.startsWith('/') && !url.indexOf('.')) ||
        url.startsWith(import.meta.env.VITE_API_BASE_URL)
      ) {
        anchor.href = anchor.href.replace(
          import.meta.env.VITE_API_BASE_URL,
          import.meta.env.VITE_BASE_URL
        );
        anchor.onclick = () => {
          navigate(url.replace(import.meta.env.VITE_API_BASE_URL, '')); // not tested
          return false;
        };
      } else if (url.startsWith('/') && url.indexOf('.') !== -1) {
        anchor.href = `${import.meta.env.VITE_API_BASE_URL}${url}`;
      }
    }
  }
})();
