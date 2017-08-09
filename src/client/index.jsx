import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { apiMiddleware } from 'redux-api-middleware';
import { BrowserRouter as Router } from 'react-router-dom';
import logger from 'redux-logger';
import { Application as RootComponent } from '../components';
import reducer from '../reducers';

const preloadedState = window.__INITIAL_STATE__; // eslint-disable-line no-underscore-dangle
const middleware = [apiMiddleware];

if (process.env.NODE_ENV !== 'production') {
  middleware.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore);
const store = createStoreWithMiddleware(reducer, preloadedState);

const render = (Component) => {
  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Component />
      </Router>
    </Provider>,
    document.getElementById('root'),
  );
};

if (module.hot) {
  module.hot.accept('../reducers', () => {
    store.replaceReducer(require('../reducers').default); // eslint-disable-line global-require
  });
  module.hot.accept('../components', () => {
    render(require('../components').Application); // eslint-disable-line global-require
  });
}

render(RootComponent);
