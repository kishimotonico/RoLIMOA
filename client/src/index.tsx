import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from './features';
import reportWebVitals from './reportWebVitals';
import App from './App';

import './index.css';

const store = configureStore({
  reducer: rootReducer,
  // devTools: process.env.NODE_ENV !== 'production',     // 今は prod でも開発ツールを有効に
});

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
