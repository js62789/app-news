import { Link } from 'react-router-dom';
import React from 'react';
import { Navbar as ReactNavbar, Nav as ReactNav } from 'lib-react-components';

export class Navbar extends React.Component {

  state = { isOpen: false }

  handleToggleClick = () => this.setState({ isOpen: !this.state.isOpen })

  render() {
    const isOpen = this.state.isOpen;
    return (
      <ReactNavbar toggleable="medium" fixed>
        <ReactNavbar.Toggle onClick={this.handleToggleClick} open={isOpen} />
        <ReactNavbar.Menu open={isOpen}>
          <ReactNavbar.Brand href="/">News</ReactNavbar.Brand>
          <ReactNavbar.Nav>
            <ReactNav.Item>
              <ReactNavbar.NavLink as={Link} to="/">Home</ReactNavbar.NavLink>
            </ReactNav.Item>
            <ReactNav.Item>
              <ReactNavbar.NavLink as={Link} to="/sources">Sources</ReactNavbar.NavLink>
            </ReactNav.Item>
          </ReactNavbar.Nav>
        </ReactNavbar.Menu>
      </ReactNavbar>
    );
  }

}

export default Navbar;
