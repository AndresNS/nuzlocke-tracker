import { Outlet } from 'react-router';

import { Header } from '@/components/header';
import { useRoutesProgress } from '@/features/encounters/hooks/use-routes-progress';

export const RootLayout = () => {
  const { resetRun } = useRoutesProgress();

  return (
    <>
      <Header onResetRunClick={resetRun} />
      <main className="container m-auto">
        <Outlet />
      </main>
    </>
  );
};
