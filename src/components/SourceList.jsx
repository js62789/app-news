import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ListGroup, Header } from 'lib-react-components';

export const SourceList = ({ sources }) => (
  <ListGroup as="div">
    {sources.map(source => (
      <ListGroup.Item key={source.id} as={Link} to={`/sources/${source.key}/articles`} action>
        <Header>{source.name}</Header>
      </ListGroup.Item>
    ))}
  </ListGroup>
);

SourceList.propTypes = {
  sources: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
  })),
};

SourceList.defaultProps = {
  sources: [],
};

export default SourceList;
