import type { App } from 'vue';
import { isClientSide } from '#src/utils/ssrUtils';

export function addFallbackImageDirective(app: App) {
  app.directive('fallback-image', {
    mounted: fallbackImageDirective,
  });
}

/**
 * Detects if the given element has a src-attribute with a value that throws an error. If so replace the src with a fallback image.
 */
export function fallbackImageDirective(el: HTMLImageElement) {
  if (!isClientSide()) {
    return; // return if server-side rendering
  }

  if (el.nodeName !== 'IMG') {
    return; // The fallback-image directive should only be applied to <img> elements;
  }

  const fallBackImage = '/static/img/placeholder-image.jpg';
  const original = el.getAttribute('data-lazy-src');

  if (!original) {
    console.warn('The element does not have a data-lazy-src attribute.');
    return;
  }

  // Returning early, original and fallback were the same
  if (original === fallBackImage) {
    return;
  }

  const img = new Image();
  img.onload = () => {
    el.src = original;
  };

  // set fallback image
  img.onerror = () => {
    img.onerror = null; // Guard against recursion
    el.removeAttribute('data-lazy-srcset');
    el.removeAttribute('srcset');
    el.removeAttribute('data-lazy-src');

    el.src = fallBackImage;
  };

  img.src = original;
}
