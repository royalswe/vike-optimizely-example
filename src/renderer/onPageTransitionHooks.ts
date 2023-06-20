export { onHydrationEnd, onPageTransitionStart, onPageTransitionEnd };

function onHydrationEnd() {
  console.log(
    'Hydration finished; page is now interactive. notice if this runs on client navigation something is wrong.'
  );
}
function onPageTransitionStart() {
  console.log('Page transition start, runs on client navigation start');
  document.querySelector('.content')?.classList.add('page-transition');
}
function onPageTransitionEnd() {
  console.log('Page transition end, runs on client navigation end');
  document.querySelector('.content')?.classList.remove('page-transition');
}
