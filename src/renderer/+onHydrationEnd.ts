import type { OnHydrationEndAsync } from 'vike/types';

const onHydrationEnd: OnHydrationEndAsync = async (): ReturnType<OnHydrationEndAsync> => {
  console.log('Hydration finished; page is now interactive, runs once only');
};

export { onHydrationEnd }