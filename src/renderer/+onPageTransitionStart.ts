import type { OnPageTransitionStartAsync } from 'vike/types';

const onPageTransitionStart: OnPageTransitionStartAsync = async (): ReturnType<OnPageTransitionStartAsync> => {
  console.log('Page transition start, runs on client navigation start');
  document.querySelector('.content')?.classList.add('page-transition');
};

export { onPageTransitionStart };