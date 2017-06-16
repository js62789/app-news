const config = require('config');

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-cssnext': {
      browsers: config.get('browsers'),
    },
  },
};
