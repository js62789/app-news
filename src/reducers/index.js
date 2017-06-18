import { combineReducers } from 'redux';
import sources from './sources';
import articles from './articles';

export default combineReducers({
  sources,
  articles,
});
