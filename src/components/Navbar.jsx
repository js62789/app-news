import { Link } from 'react-router-dom';
import React from 'react';
import { Navbar as ReactNavbar, Nav as ReactNav } from 'lib-react-components';

export const Navbar = () => (
  <ReactNavbar toggleable="medium">
    <ReactNavbar.Toggle />
    <ReactNavbar.Menu>
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

export default Navbar;
