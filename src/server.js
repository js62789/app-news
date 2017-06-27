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

app.get('/sources', async (req, res, next) => {
  const sourcesResponse = await fetch(`${API}/sources`);
  const body = await sourcesResponse.json();

  const sourcesByKey = {};

  body.sources.forEach((source) => {
    sourcesByKey[source.key] = source;
  });

  req.initialState = {
    ...req.initialState,
    sources: {
      isFetchingSources: false,
      hasFetchedAll: true,
      sourcesByKey,
    },
  };

  next();
});

app.get('/sources/:source/articles', async (req, res, next) => {
  const sourceKey = req.params.source;
  const sourcesResponse = await fetch(`${API}/sources/${sourceKey}`);
  const articlesResponse = await fetch(`${API}/sources/${sourceKey}/articles`);
  const sourcesBody = await sourcesResponse.json();
  const articlesBody = await articlesResponse.json();
  const sourcesByKey = {};
  const articlesByGuid = {};

  sourcesBody.sources.forEach((source) => {
    sourcesByKey[source.key] = source;
  });

  articlesBody.articles.forEach((a) => {
    articlesByGuid[a.guid] = a;
  });

  req.initialState = {
    ...req.initialState,
    articles: {
      isFetchingArticles: false,
      articlesByGuid,
      guidsBySource: {
        [sourceKey]: articlesBody.articles.map(a => a.guid),
      },
    },
    sources: {
      isFetchingSources: false,
      hasFetchedAll: false,
      sourcesByKey,
    },
  };

  next();
});

app.get('/articles/:article_id', async (req, res, next) => {
  const guid = req.params.article_id;
  const articlesResponse = await fetch(`${API}/articles/${encodeURIComponent(guid)}`);
  const articlesBody = await articlesResponse.json();
  const articlesByGuid = {};

  articlesBody.articles.forEach((a) => {
    articlesByGuid[a.guid] = a;
  });

  req.initialState = {
    ...req.initialState,
    articles: {
      isFetchingArticles: false,
      articlesByGuid,
      guidsBySource: {},
    },
  };

  next();
});

app.get('/sources/:source/articles/:article_id', async (req, res, next) => {
  const guid = req.params.article_id;
  const sourceKey = req.params.source;
  const articleResponse = await fetch(`${API}/articles/${encodeURIComponent(guid)}`);
  const sourcesResponse = await fetch(`${API}/sources/${sourceKey}`);
  const articlesResponse = await fetch(`${API}/sources/${sourceKey}/articles`);
  const articleBody = await articleResponse.json();
  const sourcesBody = await sourcesResponse.json();
  const articlesBody = await articlesResponse.json();
  const sourcesByKey = {};
  const articlesByGuid = {};

  sourcesBody.sources.forEach((source) => {
    sourcesByKey[source.key] = source;
  });

  articlesBody.articles.forEach((a) => {
    articlesByGuid[a.guid] = a;
  });

  Object.assign(articlesByGuid[guid], articleBody.articles[0]);

  req.initialState = {
    ...req.initialState,
    articles: {
      isFetchingArticles: false,
      articlesByGuid,
      guidsBySource: {
        [sourceKey]: articlesBody.articles.map(a => a.guid),
      },
    },
    sources: {
      isFetchingSources: false,
      hasFetchedAll: false,
      sourcesByKey,
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
