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
   // eslint-disable-next-line <global-require></global-require>
  const webpackConfig = require('../../webpack.config.babel').default;

  const compiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(compiler, {
    publicPath: '/',
  }));

  app.use(webpackHotMiddleware(compiler));
}

app.use(router);

app.use(express.static('dist'));

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

  res.send(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title>Universal React Application</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-alpha.6/css/bootstrap.min.css" integrity="sha384-rwoIResjU2yc3z8GV/NPeZWAv56rSmLldC3R/AZzGRnGxQQKnKkoFVhFQhNUwEyJ" crossorigin="anonymous">
        <link rel="stylesheet" href="/bundle.css">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__INITIAL_STATE__ = ${JSON.stringify(finalState).replace(/</g, '\\u003c')}
        </script>
       <script src="/bundle.js"></script>
      </body>
    </html>
  `);
});

export default app;
