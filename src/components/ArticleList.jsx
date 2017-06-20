import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ListGroup } from 'lib-react-components';
import ArticleListItem from './ArticleListItem';

const API = 'http://localhost:3002/v1';

class ArticleListComponent extends React.Component {
  static propTypes = {
    isFetchingArticles: PropTypes.bool.isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
    })).isRequired,
    fetchArticles: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        source: PropTypes.string,
      }).isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
  }
  componentDidMount() {
    const source = this.props.match.params.source;
    if (source && !this.props.articles.length && !this.props.isFetchingArticles) {
      this.props.fetchArticles(this.props.match.params.source);
    }
  }
  render() {
    const { isFetchingArticles, articles } = this.props;
    return (
      <ListGroup as="div" loading={isFetchingArticles}>
        {articles.map(article => <ArticleListItem key={article.guid} article={article} />)}
      </ListGroup>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const articleGuids = state.articles.guidsBySource[ownProps.match.params.source] || [];

  const sortByDate = (a, b) => {
    const aValue = (new Date(a.date)).getTime();
    const bValue = (new Date(b.date)).getTime();
    if (aValue < bValue) {
      return 1;
    }
    if (aValue > bValue) {
      return -1;
    }
    return 0;
  };

  return {
    isFetchingArticles: state.articles.isFetchingArticles,
    articles: articleGuids.map(guid => state.articles.articlesByGuid[guid]).sort(sortByDate),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchArticles: async (source) => {
    dispatch({
      type: 'ARTICLES_FETCH',
    });
    const articlesResponse = await fetch(`${API}/sources/${source}/articles`);
    const body = await articlesResponse.json();
    dispatch({
      type: 'ARTICLES_FETCH_SUCCESS',
      payload: {
        body,
      },
    });
  },
});


const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const ArticleList = withRouter(withRedux(ArticleListComponent));

export default ArticleList;
