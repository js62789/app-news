import React from 'react';
import PropTypes from 'prop-types';
import fromNow from 'mininow';
import { ListGroup, Flex, Header, Text } from 'lib-react-components';

export const ArticleListItem = ({ article }) => (
  <ListGroup.Item key={article.guid} as="a" href={article.link} target="_blank" action>
    <Flex alignItems="start" direction="column">
      <Header as="h2">{article.title}</Header>
      <Text small>
        {article.date && <span>{fromNow(new Date(article.date))} </span>}
        <span>by {article.author}</span>
      </Text>
      <Text>{(article.description || '').replace(/<\/?[^>]+(>|$)/g, '')}</Text>
    </Flex>
  </ListGroup.Item>
);

ArticleListItem.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

ArticleListItem.defaultProps = {
  article: {
    description: '',
    image: '',
  },
};

export default ArticleListItem;
