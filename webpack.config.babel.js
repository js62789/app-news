import path from 'path';
import fs from 'fs';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

const isProd = (process.env.NODE_ENV === 'production');

const babelWithoutCSSModules = JSON.parse(fs.readFileSync('./.babelrc'));

// Remove css modules transform from babelrc
babelWithoutCSSModules.plugins.pop();

/* Entry */

const entry = [
  './client',
];

if (!isProd) {
  entry.unshift('webpack-hot-middleware/client');
}

/* Rules */

const rules = [
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    options: {
      ...babelWithoutCSSModules,
      babelrc: false,
    },
  },
];

if (isProd) {
  rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        'postcss-loader',
      ],
    }),
  });
} else {
  rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]__[local]___[hash:base64:5]',
        },
      },
      'postcss-loader',
    ],
  });
}

/* Plugins */

const plugins = [
  new webpack.EnvironmentPlugin({
    NODE_ENV: 'development',
  }),
];

if (isProd) {
  plugins.push.apply(plugins, [
    new ExtractTextPlugin('bundle.css'),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
    }),
  ]);
} else {
  plugins.push.apply(plugins, [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
  ]);
}

export default {

  context: path.join(__dirname, 'src'),

  devtool: isProd ? 'cheap-source-map' : 'inline-source-map',

  entry,

  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },

  module: {
    rules,
  },

  plugins,

};
