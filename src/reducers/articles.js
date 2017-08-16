import {
  FETCH_ARTICLES,
  FETCH_ARTICLES_BY_SOURCE,
  FETCH_ARTICLES_SUCCESS,
  FETCH_ARTICLES_BY_SOURCE_SUCCESS,
} from '../actions';

const defaultState = {
  isFetchingArticles: false,
  articlesByGuid: {},
  guidsBySource: {},
};

const uniq = (arr) => {
  const keys = {};
  return arr.filter((item) => {
    if (keys[item]) {
      return false;
    }
    keys[item] = true;
    return true;
  });
};

export default (state = defaultState, action) => {
  const payload = action.payload;
  const { articlesByGuid, guidsBySource } = state;
  let articles;
  let source;

  switch (action.type) {
    case FETCH_ARTICLES_BY_SOURCE:
    case FETCH_ARTICLES:
      return {
        ...state,
        isFetchingArticles: true,
      };

    case FETCH_ARTICLES_BY_SOURCE_SUCCESS:
      articles = payload.articles;
      source = payload.source;

      articles.forEach((a) => {
        articlesByGuid[a.guid] = {
          ...articlesByGuid[a.guid],
          ...a,
        };
      });

      return {
        ...state,
        isFetchingArticles: false,
        articlesByGuid: {
          ...articlesByGuid,
        },
        guidsBySource: {
          ...guidsBySource,
          [source]: uniq((guidsBySource[source] || []).concat(articles.map(a => a.guid))),
        },
      };

    case FETCH_ARTICLES_SUCCESS:
      articles = payload.articles;

      articles.forEach((a) => {
        articlesByGuid[a.guid] = {
          ...articlesByGuid[a.guid],
          ...a,
        };
      });

      return {
        ...state,
        isFetchingArticles: false,
        articlesByGuid: {
          ...articlesByGuid,
        },
      };

    default:
      return state;
  }
};
