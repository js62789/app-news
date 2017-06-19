import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'lib-react-components';
import { SourceArticles, SourceList, Navbar } from './';

export const Application = () => (
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
          render={() => <SourceList />}
        />
        <Route
          path="/sources/:source/articles"
          render={() => <SourceArticles />}
        />
      </Switch>
    </Container>
  </div>
);

export default Application;
