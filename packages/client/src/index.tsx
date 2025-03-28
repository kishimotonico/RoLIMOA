import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '@/slices';
import App from './App';

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== 'production',     // 今は prod でも開発ツールを有効に
});

const container = document.getElementById('root');
// biome-ignore lint/style/noNonNullAssertion: <explanation>
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <RecoilRoot>
        <Provider store={store}>
          <App />
        </Provider>
      </RecoilRoot>
    </BrowserRouter>
  </React.StrictMode>
);
