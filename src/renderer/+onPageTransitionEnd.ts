import type { OnPageTransitionEndAsync } from 'vike/types';

const onPageTransitionEnd: OnPageTransitionEndAsync = async (): ReturnType<OnPageTransitionEndAsync> => {
  console.log('Page transition end, runs on client navigation end');
  document.querySelector('.content')?.classList.remove('page-transition');
};

export { onPageTransitionEnd };