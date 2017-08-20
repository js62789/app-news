import config from 'config';

const links = config.get('links');

const buildElement = (tagName, attributes) => (
  `<${tagName} ${Object.entries(attributes).map(([k, v]) => `${k}="${v}"`).join(' ')} />`
);

const createElementBuilder = tagName => (
  link => buildElement(tagName, link)
);

export default (html, state) => (`
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <title>Universal React Application</title>
      <meta name="viewport" content="width=device-width, initial-scale=1">
      ${links.map(createElementBuilder('link')).join('\n')}
      <link rel="stylesheet" href="/bundle.css">
    </head>
    <body>
      <div id="root">${html}</div>
      <script>
        // WARNING: See the following for security issues around embedding JSON in HTML:
        // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
        window.__INITIAL_STATE__ = ${JSON.stringify(state).replace(/</g, '\\u003c')}
      </script>
     <script src="/bundle.js"></script>
    </body>
  </html>
`);
