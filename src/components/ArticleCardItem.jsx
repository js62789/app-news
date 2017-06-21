import React from 'react';
import PropTypes from 'prop-types';
import { Card, Flex } from 'lib-react-components';

export const ArticleCardItem = ({ article }) => (
  <Card>
    {article.image && article.image &&
      <Card.Image src={article.image} alt={article.title} position="top" />
    }
    <Card.Block>
      <Flex direction="column">
        <Card.Title as="a" href={article.link} target="_blank">{article.title}</Card.Title>
        <Card.Text small>
          {article.pubdate && <span>{(new Date(article.date)).toDateString()} </span>}
          <span>by {article.author}</span>
        </Card.Text>
        <Card.Text>{(article.description || '').replace(/<\/?[^>]+(>|$)/g, '')}</Card.Text>
      </Flex>
    </Card.Block>
  </Card>
);

ArticleCardItem.propTypes = {
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

export default ArticleCardItem;
