import React from 'react';
import PropTypes from 'prop-types';
import { ListGroup, Header, Text } from 'lib-react-components';

export const ArticleListItem = ({ article }) => (
  <ListGroup.Item key={article.guid} as="a" href={article.link} target="_blank" action>
    <Header>{article.title}</Header>
    <Text small>{(new Date(article.pubdate)).toDateString()} by {article.author}</Text>
    <Text>{article.description.replace(/<\/?[^>]+(>|$)/g, '')}</Text>
  </ListGroup.Item>
);

ArticleListItem.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleListItem;
