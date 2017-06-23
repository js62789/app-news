import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ListGroup, Card } from 'lib-react-components';
import { ArticleListItem, ArticleCardItem } from './';

const API = 'http://localhost:3002/v1';

class ArticleListComponent extends React.Component {
  static propTypes = {
    showSummary: PropTypes.bool,
    source: PropTypes.string.isRequired,
    isFetchingArticles: PropTypes.bool.isRequired,
    articles: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
    })).isRequired,
    fetchArticles: PropTypes.func.isRequired,
  }
  static defaultProps = {
    showSummary: false,
  }
  state = { fetchInterval: null }
  componentDidMount() {
    const source = this.props.source;
    if (source && !this.props.articles.length && !this.props.isFetchingArticles) {
      this.props.fetchArticles(source);
      this.updateEvery(5 * 60 * 1000);
    }
  }
  updateEvery(interval) {
    const { source, fetchArticles } = this.props;
    const fetchInterval = setInterval(fetchArticles.bind(this, source), interval);
    if (this.state.fetchInterval) {
      clearInterval(this.state.fetchInterval);
    }
    this.setState({ fetchInterval });
  }
  renderList() {
    const { isFetchingArticles, articles, source, showSummary } = this.props;
    return (
      <ListGroup as="div" loading={isFetchingArticles && !articles.length}>
        {articles.map(article => (
          <ArticleListItem
            key={article.guid}
            article={article}
            source={source}
            showSummary={showSummary}
          />
        ))}
      </ListGroup>
    );
  }
  renderBoard() {
    const { articles, source } = this.props;
    return (
      <Card.Columns>
        {articles.map(article => (
          <ArticleCardItem key={article.guid} article={article} source={source} />
        ))}
      </Card.Columns>
    );
  }
  render() {
    return this.renderList();
  }
}

const mapStateToProps = (state, ownProps) => {
  const source = ownProps.match.params.source;
  const articleGuids = state.articles.guidsBySource[source] || [];

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
    source,
    isFetchingArticles: state.articles.isFetchingArticles,
    articles: articleGuids.map(guid => state.articles.articlesByGuid[guid]).sort(sortByDate),
  };
};

const mapDispatchToProps = dispatch => ({
  fetchArticles: async (source) => {
    dispatch({
      type: 'ARTICLES_FETCH',
    });
    const articlesResponse = await fetch(`${API}/sources/${source}/articles?limit=10`);
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
