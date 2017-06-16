const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const nodeEnv = process.env.NODE_ENV;
const isProd = nodeEnv === 'production';

const clientConfig = {

  name: 'client',

  target: 'web',

  devtool: isProd ? 'source-map' : 'cheap-module-source-map',

  entry: {
    client: [
      './src/client',
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      }
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
  ],

};

if (isProd) {
  clientConfig.devtool = 'cheap-source-map';
  clientConfig.module.rules.push({
    test: /\.css$/,
    loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader?modules&importLoaders=1!postcss-loader' }),
  });
  clientConfig.plugins.push(new ExtractTextPlugin('bundle.css'));
  clientConfig.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
  clientConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }));
} else {
  clientConfig.module.rules.push({
    test: /\.css$/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true,
        },
      },
      'postcss-loader'
    ],
  });
  clientConfig.devtool = 'inline-source-map';
}

const serverConfig = {

  name: 'server',

  target: 'node',

  externals: [nodeExternals({
    whitelist: ['lib-react-components']
  })],

  entry: {
    server: './src/server',
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules&importLoaders=1!postcss-loader'
        }),
      }
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new ExtractTextPlugin('bundle.css')
  ],

};

if (isProd) {
  serverConfig.plugins.push(new webpack.LoaderOptionsPlugin({
    minimize: true,
    debug: false,
  }));
  serverConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    output: {
      comments: false,
    },
  }));
}

module.exports = [clientConfig, serverConfig];
