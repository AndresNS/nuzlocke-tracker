import { use } from 'react';

import { RoutesProgressContext } from '../stores/routes-progress-context';

export const useRoutesProgress = () => {
  const context = use(RoutesProgressContext);
  if (!context)
    throw new Error(
      'useRoutesProgress must be used within RoutesProgressProvider',
    );

  return context;
};
