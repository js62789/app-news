import config from 'config';
import express from 'express';
import fetch from 'isomorphic-fetch';
import render from './render';

const PORT = config.get('port');
const app = express();

app.use(express.static('dist'));

app.use('/sources/:source/articles', (req, res, next) => {
  fetch(`http://localhost:3002/v1/sources/${req.params.source}/articles`)
    .then((articlesResponse) => {
      return articlesResponse.json()
        .then((body) => {
          req.initialState = {
            articles: {
              isFetchingArticles: false,
              articles: body.articles,
            },
          };
          next();
        });
    });
});

app.use(render);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.code).send({
    error: err,
  });
});

app.listen(PORT, () => {
// eslint-disable-next-line no-console
  console.log(`Running on http://localhost:${PORT} in ${config.util.getEnv('NODE_ENV')}`);
});
