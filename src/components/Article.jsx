import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Header, Text } from 'lib-react-components';

const API = 'http://localhost:3002/v1';

class ArticleComponent extends React.Component {
  static propTypes = {
    isFetchingArticles: PropTypes.bool.isRequired,
    article: PropTypes.shape({
      content: PropTypes.string.isRequired,
    }),
    fetchArticle: PropTypes.func.isRequired,
  }
  static defaultProps = {
    article: null,
  }
  componentDidMount() {
    if ((!this.props.article || !this.props.article.content) && !this.props.isFetchingArticles) {
      this.props.fetchArticle();
    }
  }
  render() {
    const { article } = this.props;
    return (
      <div>
        <Header>{article.title}</Header>
        <Text muted>by {article.author}</Text>
        {article && <div dangerouslySetInnerHTML={{ __html: article.content }} />}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const guid = decodeURIComponent(ownProps.match.params.article_id);
  return {
    isFetchingArticles: state.articles.isFetchingArticles,
    article: state.articles.articlesByGuid[guid],
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchArticle: async () => {
    dispatch({
      type: 'ARTICLES_FETCH',
    });
    const sourceResponse = await fetch(`${API}/articles/${ownProps.match.params.article_id}`);
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
