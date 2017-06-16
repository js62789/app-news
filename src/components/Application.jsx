import React from 'react';
import { connect } from 'react-redux';
import fetch from 'isomorphic-fetch';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom';
import { Container, ListGroup } from 'lib-react-components';

class Application extends React.Component {
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
    const { articles } = this.props;
    return (
      <Container>
        <Route
          path="/sources/:source/articles"
          render={() => (
            <ListGroup>
              {articles.map(article => (
                <ListGroup.Item key={article.guid}>{article.title}</ListGroup.Item>
              ))}
            </ListGroup>
          )}
        />
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(Application);
