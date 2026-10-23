import type { ReactNode } from 'react';

import { RoutesProgressProvider } from '@/features/encounters/stores/routes-progress-provider';

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return <RoutesProgressProvider>{children}</RoutesProgressProvider>;
};
