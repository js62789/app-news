import React from 'react';
import PropTypes from 'prop-types';
import fetch from 'isomorphic-fetch';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ListGroup, Header } from 'lib-react-components';

const API = 'http://localhost:3002/v1';

class SourceListComponent extends React.Component {
  static propTypes = {
    hasFetchedAll: PropTypes.bool.isRequired,
    isFetchingSources: PropTypes.bool.isRequired,
    sources: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })).isRequired,
    fetchSources: PropTypes.func.isRequired,
  }
  componentDidMount() {
    if (!this.props.hasFetchedAll) {
      this.props.fetchSources();
    }
  }
  render() {
    const { sources, isFetchingSources } = this.props;
    return (
      <ListGroup as="div" loading={isFetchingSources}>
        {sources.map(source => (
          <ListGroup.Item key={source.key} as={Link} to={`/sources/${source.key}/articles`} action>
            <Header>{source.name}</Header>
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }
}

const mapStateToProps = (state) => {
  const { hasFetchedAll, isFetchingSources, sourcesByKey } = state.sources;
  const sources = Object.keys(sourcesByKey).map(key => sourcesByKey[key]);
  return {
    hasFetchedAll,
    isFetchingSources,
    sources,
  };
};

const mapDispatchToProps = dispatch => ({
  fetchSources: async () => {
    dispatch({
      type: 'SOURCES_FETCH',
    });
    const sourcesResponse = await fetch(`${API}/sources`);
    const body = await sourcesResponse.json();
    dispatch({
      type: 'SOURCES_FETCH_SUCCESS',
      payload: {
        body,
      },
    });
  },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const SourceList = withRouter(withRedux(SourceListComponent));

export default SourceList;
