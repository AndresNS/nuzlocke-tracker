import { createHashRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { RootLayout } from './routes/root-layout';
import { Stage } from './routes/stage';

const router = createHashRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ path: 'stage', Component: Stage }],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
