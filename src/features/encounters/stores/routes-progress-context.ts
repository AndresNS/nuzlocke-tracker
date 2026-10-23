import { createContext } from 'react';

import type { useStoredRoutesProgress } from '../hooks/use-stored-routes-progress';

export const RoutesProgressContext = createContext<
  ReturnType<typeof useStoredRoutesProgress> | undefined
>(undefined);
