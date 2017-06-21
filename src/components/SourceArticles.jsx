import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Image } from 'lib-react-components';
import { ArticleList } from './';

const API = 'http://localhost:3002/v1';

class SourceArticlesComponent extends React.Component {
  static propTypes = {
    isFetchingSource: PropTypes.bool.isRequired,
    source: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }),
    fetchSource: PropTypes.func.isRequired,
  }
  static defaultProps = {
    source: {},
  }
  componentDidMount() {
    const source = this.props.source;
    if (source && !this.props.source && !this.props.isFetchingSource) {
      this.props.fetchSource(source);
    }
  }
  render() {
    const { source } = this.props;
    return (
      <div>
        <Image src={source.logo} alt={source.name} height={80} />
        <ArticleList />
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const source = ownProps.match.params.source;
  return {
    isFetchingSource: state.sources.isFetchingSources,
    source: state.sources.sourcesByKey[source],
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSource: async (source) => {
    dispatch({
      type: 'SOURCE_FETCH',
    });
    const sourceResponse = await fetch(`${API}/sources/${source}`);
    const body = await sourceResponse.json();
    dispatch({
      type: 'SOURCE_FETCH_SUCCESS',
      payload: {
        body,
      },
    });
  },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const SourceArticles = withRouter(withRedux(SourceArticlesComponent));

export default SourceArticles;
