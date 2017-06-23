import React from 'react';
import PropTypes from 'prop-types';
import fromNow from 'mininow';
import { Link } from 'react-router-dom';
import { ListGroup, Flex, Header, Text } from 'lib-react-components';

export const ArticleListItem = ({ source, article, showSummary }) => (
  <ListGroup.Item key={article.guid} as={Link} to={`${source && `/sources/${source}`}/articles/${encodeURIComponent(article.guid)}`} action>
    <Flex alignItems="start" direction="column">
      <Header as="h2">{article.title}</Header>
      <Text small>
        {article.date && <span>{fromNow(new Date(article.date))} </span>}
        <span>by {article.author}</span>
      </Text>
      {showSummary &&
        <Text>{(article.description || '').replace(/<\/?[^>]+(>|$)/g, '')}</Text>
      }
    </Flex>
  </ListGroup.Item>
);

ArticleListItem.propTypes = {
  showSummary: PropTypes.bool,
  source: PropTypes.string,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
};

ArticleListItem.defaultProps = {
  showSummary: false,
  source: null,
  article: {
    description: '',
    image: '',
  },
};

export default ArticleListItem;
