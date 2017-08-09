import {
  FETCH_SOURCE,
  FETCH_SOURCES,
  FETCH_SOURCE_SUCCESS,
  FETCH_SOURCES_SUCCESS,
} from '../actions';

const defaultState = {
  isFetchingSources: false,
  hasFetchedAll: false,
  sourcesByKey: {},
};

export default (state = defaultState, action) => {
  const { sourcesByKey } = state;

  switch (action.type) {
    case FETCH_SOURCE:
      return {
        ...state,
        isFetchingSources: true,
      };

    case FETCH_SOURCES:
      return {
        ...state,
        isFetchingSources: true,
        hasFetchedAll: true,
      };

    case FETCH_SOURCE_SUCCESS:
    case FETCH_SOURCES_SUCCESS:
      action.payload.sources.forEach((source) => {
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
