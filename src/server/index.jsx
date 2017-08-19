import React from 'react';
import express from 'express';
import { createStore, applyMiddleware } from 'redux';
import { apiMiddleware } from 'redux-api-middleware';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom';
import morgan from 'morgan';
import config from 'config';
import { Application as RootComponent } from '../components';
import reducer from '../reducers';
import router from './router';
import render from './render';

const app = express();

// Modes: combined, common, dev, short, tiny
// See https://www.npmjs.com/package/morgan#predefined-formats
app.use(morgan(config.get('log.mode')));

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line global-require
  const webpack = require('webpack');
   // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const webpackDevMiddleware = require('webpack-dev-middleware');
   // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const webpackHotMiddleware = require('webpack-hot-middleware');
   // eslint-disable-next-line global-require
  const webpackConfig = require('../../webpack.config.babel').default;

  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(router);

app.use(express.static('dist'));

app.use(express.static('static'));

app.get('*', (req, res) => {
  const createStoreWithMiddleware = applyMiddleware(apiMiddleware)(createStore);
  const store = createStoreWithMiddleware(reducer, req.initialState || {});
  const context = {};

  const html = ReactDOMServer.renderToString(
    <Provider store={store}>
      <Router location={req.url} context={context}>
        <RootComponent />
      </Router>
    </Provider>,
  );

  if (context.url) {
    // Somewhere a `<Redirect>` was rendered
    res.redirect(301, context.url);
    return;
  }

  const finalState = store.getState();

  res.send(render(html, finalState));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.code || 500).send({
    error: err,
  });
});

export default app;
