import express from 'express';
import config from 'config';
import fetch from 'isomorphic-fetch';

const API = config.get('newsApi');
const router = express.Router();

router.get('/sources', async (req, res, next) => {
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

router.get('/sources/:source/articles', async (req, res, next) => {
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

router.get('/articles/:article_id', async (req, res, next) => {
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

router.get('/sources/:source/articles/:article_id', async (req, res, next) => {
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

  if (articlesByGuid[guid]) {
    Object.assign(articlesByGuid[guid], articleBody.articles[0]);
  } else {
    articlesByGuid[guid] = articleBody.articles[0];
  }

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

export default router;
