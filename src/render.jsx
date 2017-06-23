import React from 'react';
import express from 'express';
import { createStore } from 'redux';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter as Router } from 'react-router-dom';
import reactApp from './reducers';
import Application from './components/Application';

const router = express.Router();

router.get('*', async (req, res) => {
  const context = {};
  const store = createStore(reactApp, req.initialState);
  const html = ReactDOMServer.renderToString(
    <Router location={req.url} context={context}>
      <Provider store={store}>
        <Application />
      </Provider>
    </Router>,
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
        <title>Redux Universal Example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" type="text/css" href="/bundle.css" />
      </head>
      <body style="height: 100vh;">
        <div id="root">${html}</div>
        <script>
          // WARNING: See the following for security issues around embedding JSON in HTML:
          // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
          window.__PRELOADED_STATE__ = ${JSON.stringify(finalState).replace(/</g, '\\u003c')}
        </script>
        <script src="/client.bundle.js"></script>
      </body>
    </html>
  `);
});

export default router;
