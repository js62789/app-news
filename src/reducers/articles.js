const defaultState = {
  isFetchingArticles: false,
  articlesByGuid: {},
  guidsBySource: {},
};

export default (state = defaultState, action) => {
  const payload = action.payload;
  const { articlesByGuid, guidsBySource } = state;
  let articles;
  let source;

  switch (action.type) {
    case 'SOURCE_ARTICLES_FETCH':
    case 'ARTICLES_FETCH':
      return {
        ...state,
        isFetchingArticles: true,
      };

    case 'SOURCE_ARTICLES_FETCH_SUCCESS':
      articles = payload.body.articles;
      source = payload.body.source;

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
          [source]: (guidsBySource[source] || []).concat(articles.map(a => a.guid)),
        },
      };

    case 'ARTICLES_FETCH_SUCCESS':
      articles = payload.body.articles;

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
