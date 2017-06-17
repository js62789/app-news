import React from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router';
import { Container } from 'lib-react-components';
import { ArticleList, SourceList, Navbar } from './';

const sources = [
  {
    id: 1,
    name: 'New York Times',
    key: 'nytimes',
  },
];

export class Application extends React.Component {
  static propTypes = {
    articles: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
    })),
    fetchArticles: PropTypes.func.isRequired,
  }
  static defaultProps = {
    articles: [],
  }
  componentDidMount() {
    if (!this.props.articles.length) {
      this.props.fetchArticles('nytimes');
    }
  }
  render() {
    return (
      <div>
        <Navbar />
        <Container>
          <Switch>
            <Route
              exact
              path="/"
              render={() => <div>Home</div>}
            />
            <Route
              exact
              path="/sources"
              render={() => <SourceList sources={sources} />}
            />
            <Route
              path="/sources/:source/articles"
              render={() => <ArticleList articles={this.props.articles} />}
            />
          </Switch>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  articles: state.articles.articles,
});

const mapDispatchToProps = dispatch => ({
  fetchArticles: (source) => {
    dispatch({
      type: 'ARTICLES_FETCH',
    });
    fetch(`http://localhost:3002/v1/sources/${source}/articles`)
      .then((articlesResponse) => {
        return articlesResponse.json()
          .then((body) => {
            dispatch({
              type: 'ARTICLES_FETCH_SUCCESS',
              payload: body,
            });
          });
      });
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Application));
