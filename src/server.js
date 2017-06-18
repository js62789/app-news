import config from 'config';
import express from 'express';
import fetch from 'isomorphic-fetch';
import render from './render';

const PORT = config.get('port');
const API = config.get('newsApi');
const app = express();

if (config.get('hot')) {
  const webpack = require('webpack'); // eslint-disable-line global-require
  const webpackConfig = require('../webpack.config.js'); // eslint-disable-line global-require
  const compiler = webpack(webpackConfig[0]);
  const webpackDevMiddleware = require('webpack-dev-middleware'); // eslint-disable-line global-require
  const webpackHotMiddleware = require('webpack-hot-middleware'); // eslint-disable-line global-require

  app.use(webpackDevMiddleware(compiler));
  app.use(webpackHotMiddleware(compiler));
}

app.use(express.static('dist'));

app.use('/sources', async (req, res, next) => {
  const sourcesResponse = await fetch(`${API}/sources`);
  const body = await sourcesResponse.json();

  req.initialState = {
    ...req.initialState,
    sources: {
      isFetchingSources: false,
      sources: body.sources,
    },
  };

  next();
});

app.use('/sources/:source/articles', async (req, res, next) => {
  const articlesResponse = await fetch(`${API}/sources/${req.params.source}/articles`);
  const body = await articlesResponse.json();

  const articlesByGuid = {};

  body.articles.forEach(a => {
    articlesByGuid[a.guid] = a;
  });

  req.initialState = {
    ...req.initialState,
    articles: {
      isFetchingArticles: false,
      articlesByGuid,
      guidsBySource: {
        [req.params.source]: body.articles.map(a => a.guid),
      },
    },
  };

  next();
});

app.use(render);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.code).send({
    error: err,
  });
});

app.listen(PORT, () => {
// eslint-disable-next-line no-console
  console.log(`Running on http://localhost:${PORT} in ${config.util.getEnv('NODE_ENV')}`);
});
