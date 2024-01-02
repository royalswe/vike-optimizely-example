import 'lazysizes';

export default new (class LazyService {
  /**
   * Add lazy backgrounds
   */
  public addLazyBackgrounds() {
    // Add simple support for background images lazy loading:
    document.addEventListener('lazybeforeunveil', (e: any) => {
      const bg = e.target.getAttribute('data-bg');
      if (bg) {
        e.target.style.backgroundImage = 'url(' + bg + ')';
      }
    });
  }
})();
