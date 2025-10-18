import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { CustomProvider } from 'rsuite';

import { router } from './router';
import './index.css'; // если используешь scss
import 'normalize.css';
import 'rsuite/dist/rsuite-no-reset.min.css';

import { store } from '../redux-rtk/store';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomProvider theme="light">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </CustomProvider>
  </StrictMode>,
);
