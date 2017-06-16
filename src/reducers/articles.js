const defaultState = {
  isFetchingArticles: false,
  articles: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'ARTICLES_FETCH':
      return {
        ...state,
        isFetchingArticles: true,
      };

    case 'ARTICLES_FETCH_SUCCESS':
      return {
        isFetchingArticles: false,
        articles: action.payload.articles,
      };

    default:
      return state;
  }
};
