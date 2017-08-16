import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Container } from 'lib-react-components';
import { SourceArticles, SourceList, Navbar, Article, ArticleViewer } from './';

const Application = () => (
  <div>
    <Navbar />
    <Container style={{ paddingTop: 56 }} fluid>
      <Switch>
        <Route
          exact
          path="/"
          render={() => <div>Home</div>}
        />
        <Route
          exact
          path="/sources"
          render={() => <Container style={{ paddingTop: 100 }}><SourceList /></Container>}
        />
        <Route
          exact
          path="/sources/:source/articles"
          render={() => <Container style={{ paddingTop: 100 }}><SourceArticles /></Container>}
        />
        <Route
          exact
          path="/articles/:article_id"
          render={() => <Container style={{ paddingTop: 100 }}><Article /></Container>}
        />
        <Route
          exact
          path="/sources/:source/articles/:article_id"
          render={() => <ArticleViewer />}
        />
      </Switch>
    </Container>
  </div>
);

export default Application;
