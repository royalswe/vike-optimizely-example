import type { App } from 'vue';

export function addClickOutsideDirective(app: App) {
  app.directive('click-outside', {
    mounted: clickOutsideDirective,
    unmounted: removeClickOutsideDirective,
  });
}

/**
 * detects if a click is outside of chosen element
 */
export function clickOutsideDirective(el: any, binding: any) {
  el.clickOutsideEvent = function (event: Event) {
    if (
      !(
        el === event.target ||
        el.contains(event.target) ||
        (event.target as HTMLElement).nodeName === 'BUTTON' ||
        (event.target as HTMLElement).nodeName === 'A' ||
        (event.target as HTMLElement).classList.contains(
          'ignore-click-outside'
        ) ||
        (event.target as HTMLElement).closest('.ignore-click-outside')
      )
    ) {
      binding.value(event, el);
    }
  };
  document.body.addEventListener('click', el.clickOutsideEvent);
}

function removeClickOutsideDirective(el: any) {
  document.body.removeEventListener('click', el.clickOutsideEvent);
}
