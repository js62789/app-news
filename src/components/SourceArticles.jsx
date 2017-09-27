import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Image } from 'lib-react-components';
import { ArticleList } from './';
import {
  fetchSource,
} from '../actions';
import styles from '../styles.css';

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
        <h2 className={styles.sourceHeader}>
          <Image src={`/publishers/${source.logo}`} alt={source.name} height={80} />
        </h2>
        <ArticleList showSummary />
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
    dispatch(fetchSource(source));
  },
});

const withRedux = connect(mapStateToProps, mapDispatchToProps);

export const SourceArticles = withRouter(withRedux(SourceArticlesComponent));

export default SourceArticles;
