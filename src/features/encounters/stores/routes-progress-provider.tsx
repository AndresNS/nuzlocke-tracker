import type { ReactNode } from 'react';

import { useStoredRoutesProgress } from '../hooks/use-stored-routes-progress';

import { RoutesProgressContext } from './routes-progress-context';

interface RoutesProgressProviderProps {
  children: ReactNode;
}

export const RoutesProgressProvider = ({
  children,
}: RoutesProgressProviderProps) => {
  const progress = useStoredRoutesProgress();

  return (
    <RoutesProgressContext value={progress}>{children}</RoutesProgressContext>
  );
};
