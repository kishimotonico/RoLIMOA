import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import { taskObjectsReducer, initialState } from './reducer';
import reportWebVitals from './reportWebVitals';

import './index.css';
import 'semantic-ui-css/semantic.min.css';

/* eslint-disable no-underscore-dangle */
const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
  taskObjectsReducer,
  initialState,
  composeEnhancers(applyMiddleware()),
);
/* eslint-enable */

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
