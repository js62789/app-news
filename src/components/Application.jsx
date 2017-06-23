import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'lib-react-components';
import { SourceArticles, SourceList, Navbar, Article } from './';

const Application = () => (
  <div style={{ backgroundColor: '#eee' }}>
    <Navbar />
    <Container style={{ paddingTop: 60 }}>
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
        <Route
          path="/articles/:article_id"
          render={() => <Article />}
        />
      </Switch>
    </Container>
  </div>
);

export default Application;
