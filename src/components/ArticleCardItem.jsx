import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Card, Flex } from 'lib-react-components';

export const ArticleCardItem = ({ article, source }) => (
  <Card>
    {article.image && article.image &&
      <Card.Image src={article.image} alt={article.title} position="top" />
    }
    <Card.Block>
      <Flex direction="column">
        <Card.Title as={Link} to={`${source && `/sources/${source}`}/articles/${encodeURIComponent(article.guid)}`}>{article.title}</Card.Title>
        <Card.Text small>
          {article.pubdate && <span>{(new Date(article.date)).toDateString()} </span>}
          <span>by {article.author}</span>
        </Card.Text>
        {/*<Card.ImageOverlay style={{ backgroundColor: 'rgba(0,0,0,0.6)', color: 'white' }}>
          <Card.Text>{(article.description || '').replace(/<\/?[^>]+(>|$)/g, '')}</Card.Text>
        </Card.ImageOverlay>*/}
      </Flex>
    </Card.Block>
  </Card>
);

ArticleCardItem.propTypes = {
  source: PropTypes.string,
  article: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }).isRequired,
};

ArticleCardItem.defaultProps = {
  source: null,
};

export default ArticleCardItem;
