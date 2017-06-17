import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup } from 'lib-react-components';
import ArticleListItem from './ArticleListItem';

export const ArticleList = ({ articles }) => (
  <ListGroup as="div">
    {articles.map(article => <ArticleListItem key={article.guid} article={article} />)}
  </ListGroup>
);

ArticleList.propTypes = {
  articles: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string,
  })),
};

ArticleList.defaultProps = {
  articles: [],
};

export default ArticleList;
