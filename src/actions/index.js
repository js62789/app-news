import { CALL_API } from 'redux-api-middleware';

const API = 'http://localhost:3002/v1';

const toQueryString = queryObj => Object.keys(queryObj)
  .filter(key => typeof queryObj[key] !== 'undefined')
  .map(key => `${key}=${queryObj[key]}`)
  .join('&');

/* Action Types */

export const FETCH_ARTICLES = 'ARTICLES_FETCH';
export const FETCH_ARTICLES_SUCCESS = 'ARTICLES_FETCH_SUCCESS';
export const FETCH_ARTICLES_FAILURE = 'ARTICLES_FETCH_FAILURE';
export const FETCH_ARTICLES_BY_SOURCE = 'SOURCE_ARTICLES_FETCH';
export const FETCH_ARTICLES_BY_SOURCE_SUCCESS = 'SOURCE_ARTICLES_FETCH_SUCCESS';
export const FETCH_ARTICLES_BY_SOURCE_FAILURE = 'SOURCE_ARTICLES_FETCH_FAILURE';
export const FETCH_SOURCE = 'SOURCE_FETCH';
export const FETCH_SOURCE_SUCCESS = 'SOURCE_FETCH_SUCCESS';
export const FETCH_SOURCE_FAILURE = 'SOURCE_FETCH_FAILURE';
export const FETCH_SOURCES = 'SOURCES_FETCH';
export const FETCH_SOURCES_SUCCESS = 'SOURCES_FETCH_SUCCESS';
export const FETCH_SOURCES_FAILURE = 'SOURCES_FETCH_FAILURE';

/* Action Creators */

export const fetchArticle = guid => ({
  [CALL_API]: {
    endpoint: `${API}/articles/${encodeURIComponent(guid)}`,
    method: 'GET',
    types: [
      FETCH_ARTICLES,
      FETCH_ARTICLES_SUCCESS,
      FETCH_ARTICLES_FAILURE,
    ],
  },
});

export const fetchArticlesBySource = (source, query) => {
  const queryString = query && toQueryString(query);
  const URL = `${API}/sources/${source}/articles${queryString ? `?${queryString}` : ''}`;
  return {
    [CALL_API]: {
      endpoint: URL,
      method: 'GET',
      types: [
        FETCH_ARTICLES_BY_SOURCE,
        FETCH_ARTICLES_BY_SOURCE_SUCCESS,
        FETCH_ARTICLES_BY_SOURCE_FAILURE,
      ],
    },
  };
};

export const fetchSource = source => ({
  [CALL_API]: {
    endpoint: `${API}/sources/${source}`,
    method: 'GET',
    types: [
      FETCH_SOURCE,
      FETCH_SOURCE_SUCCESS,
      FETCH_SOURCE_FAILURE,
    ],
  },
});

export const fetchSources = () => ({
  [CALL_API]: {
    endpoint: `${API}/sources`,
    method: 'GET',
    types: [
      FETCH_SOURCES,
      FETCH_SOURCES_SUCCESS,
      FETCH_SOURCES_FAILURE,
    ],
  },
});
