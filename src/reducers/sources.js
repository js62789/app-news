const defaultState = {
  isFetchingSources: false,
  hasFetchedAll: false,
  sourcesByKey: {},
};

export default (state = defaultState, action) => {
  const { sourcesByKey } = state;

  switch (action.type) {
    case 'SOURCE_FETCH':
      return {
        ...state,
        isFetchingSources: true,
      };

    case 'SOURCES_FETCH':
      return {
        ...state,
        isFetchingSources: true,
        hasFetchedAll: true,
      };

    case 'SOURCE_FETCH_SUCCESS':
    case 'SOURCES_FETCH_SUCCESS':
      action.payload.body.sources.forEach((source) => {
        sourcesByKey[source.key] = source;
      });
      return {
        ...state,
        isFetchingSources: false,
        sourcesByKey: { ...sourcesByKey },
      };

    default:
      return state;
  }
};
