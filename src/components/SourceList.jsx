import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { ListGroup, Header, Image } from 'lib-react-components';
import {
  fetchSources,
} from '../actions';

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
            <Image className="rounded-circle mr-3 hidden-sm-down" src={`/publishers/${source.icon}`} height={80} width={80} alt={source.name} bordered />
            <Header className="d-inline-block align-middle">{source.name}</Header>
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
    dispatch(fetchSources());
  },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const SourceList = withRouter(withRedux(SourceListComponent));

export default SourceList;
