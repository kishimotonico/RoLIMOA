import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@rolimoa/common/redux';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import App from './App';

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== 'production',     // 今は prod でも開発ツールを有効に
});

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <Provider store={store}>
          <App />
        </Provider>
      </RecoilRoot>
    </BrowserRouter>
  </StrictMode>,
);
