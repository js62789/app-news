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
      title: PropTypes.string.isRequired,
      guid: PropTypes.string.isRequired,
    })).isRequired,
    fetchArticles: PropTypes.func.isRequired,
  }
  static defaultProps = {
    showSummary: false,
  }
  state = { fetchInterval: null, limit: 10 }
  componentDidMount() {
    const source = this.props.source;
    if (source && !this.props.articles.length && !this.props.isFetchingArticles) {
      this.updateArticles();
    }
    this.updateEvery(5 * 60 * 1000);
  }
  componentWillUnmount() {
    if (this.state.fetchInterval) {
      clearInterval(this.state.fetchInterval);
    }
  }
  componentWillUnmount() {
    if (this.state.fetchInterval) {
      clearInterval(this.state.fetchInterval);
    }
  }
  updateEvery(interval) {
    const fetchInterval = setInterval(this.updateArticles, interval);
    if (this.state.fetchInterval) {
      clearInterval(this.state.fetchInterval);
    }
    this.setState({ fetchInterval });
  }
  updateArticles = () => {
    const { source, articles } = this.props;
    this.props.fetchArticles(source, {
      after: articles[0] && articles[0].guid,
      limit: this.state.limit,
    });
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
    const aValue = (new Date(a.pubdate)).getTime();
    const bValue = (new Date(b.pubdate)).getTime();
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
  fetchArticles: async (source, query) => {
    dispatch({
      type: 'SOURCE_ARTICLES_FETCH',
    });
    const queryString = query && Object.keys(query).map(key => `${key}=${query[key]}`).join('&');
    const URL = `${API}/sources/${source}/articles${queryString ? `?${queryString}` : ''}`;
    const articlesResponse = await fetch(URL);
    const body = await articlesResponse.json();
    dispatch({
      type: 'SOURCE_ARTICLES_FETCH_SUCCESS',
      payload: {
        body,
      },
    });
  },
});


const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const ArticleList = withRouter(withRedux(ArticleListComponent));

export default ArticleList;
