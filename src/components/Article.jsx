import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Header, Text } from 'lib-react-components';
import styles from '../styles.css';

const API = 'http://localhost:3002/v1';

class ArticleComponent extends React.Component {
  static propTypes = {
    guid: PropTypes.string.isRequired,
    isFetchingArticles: PropTypes.bool.isRequired,
    article: PropTypes.shape({
      content: PropTypes.string,
    }),
    fetchArticle: PropTypes.func.isRequired,
  }
  static defaultProps = {
    article: null,
  }
  componentDidMount() {
    const guid = this.props.guid;
    const articleContentMissing = !this.props.article || !this.props.article.content;
    if (guid && articleContentMissing && !this.props.isFetchingArticles) {
      this.props.fetchArticle(guid);
    }
  }
  componentWillUpdate(nextProps) {
    const guidChanged = nextProps.guid !== this.props.guid;
    const articleContentMissing = !nextProps.article || !nextProps.article.content;
    if (guidChanged && articleContentMissing && !this.props.isFetchingArticles) {
      this.props.fetchArticle(nextProps.guid);
    }
  }
  render() {
    const { article } = this.props;
    return (
      <div>
        <div className={styles.articleBanner} style={{ backgroundImage: `url(${article.image})` }} />
        <article className={styles.article}>
          <Header>{article.title}</Header>
          <Text muted>by {article.author}</Text>
          {article &&
            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          }
        </article>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const guid = decodeURIComponent(ownProps.match.params.article_id);
  return {
    guid,
    isFetchingArticles: state.articles.isFetchingArticles,
    article: state.articles.articlesByGuid[guid],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchArticle: async (guid) => {
    dispatch({
      type: 'ARTICLES_FETCH',
    });
    const sourceResponse = await fetch(`${API}/articles/${encodeURIComponent(guid)}`);
    const body = await sourceResponse.json();
    dispatch({
      type: 'ARTICLES_FETCH_SUCCESS',
      payload: {
        body,
      },
    });
  },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const Article = withRouter(withRedux(ArticleComponent));

export default Article;
