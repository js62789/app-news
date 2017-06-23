const defaultState = {
  isFetchingArticles: false,
  articlesByGuid: {},
  guidsBySource: {},
};

export default (state = defaultState, action) => {
  const payload = action.payload;
  const articlesByGuid = state.articlesByGuid;

  switch (action.type) {
    case 'ARTICLES_FETCH':
      return {
        ...state,
        isFetchingArticles: true,
      };

    case 'ARTICLES_FETCH_SUCCESS':
      payload.body.articles.forEach((a) => {
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
          ...state.guidsBySource,
          [payload.body.source]: payload.body.articles.map(a => a.guid),
        },
      };

    default:
      return state;
  }
};
