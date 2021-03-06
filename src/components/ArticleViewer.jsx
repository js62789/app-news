import React from 'react';
import { Grid } from 'lib-react-components';
import { ArticleList, Article } from './';
import styles from '../styles.css';

export const ArticleViewer = () => (
  <div>
    <Grid.Row className="no-gutters">
      <Grid.Column className={styles.sidebar} medium="4">
        <ArticleList source="nytimes" />
      </Grid.Column>
      <Grid.Column className={styles.mainContent} mediumOffset="4">
        <Article />
      </Grid.Column>
    </Grid.Row>
  </div>
);

export default ArticleViewer;
