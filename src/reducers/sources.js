const defaultState = {
  isFetchingSources: false,
  sources: [],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'SOURCES_FETCH':
      return {
        ...state,
        isFetchingSources: true,
      };

    case 'SOURCES_FETCH_SUCCESS':
      return {
        isFetchingSources: false,
        sources: action.payload.body.sources,
      };

    default:
      return state;
  }
};
