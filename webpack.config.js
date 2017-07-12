const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

const commonPlugins = [
  new ExtractTextPlugin({
    filename: 'bundle.css',
    disable: false,
    allChunks: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: 'vendor.js',
    minChunks: 3,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = {
  entry: {
    vendor: [
      'localforage',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-dom',
      'redux',
      'redux-saga',
      'reselect',
      'emotion',
    ],
    app: ['./app/index.jsx'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/build/',
  },
  resolve: {
    alias: { '@app': path.resolve(__dirname, 'app/') },
    extensions: ['.js', '.jsx', '.scss'],
  },
  module: {
    rules: [
      // js[x]
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          plugins: [
            'emotion/babel',
          ],
          presets: [
            'react',
            ['env', { targets: { browsers: ['safari >= 10'] } }], // 100% ES2015
          ],
        },
      },

      // css
      {
        test: /\.css$/,
        exclude: /emotion\.css$/,
        use: PRODUCTION ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              modules: true,
            },
          },
        }) : [
          'style-loader',
          { loader: 'css-loader', options: { modules: false } },
        ],
      },

      // emotion.css
      {
        test: /emotion\.css$/,
        use: PRODUCTION ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        }) : [
          'style-loader',
          { loader: 'css-loader' },
        ],
      },

      // fonts
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=static/[name].[ext]',
      },

      // sass
      {
        test: /\.scss$/,
        use: PRODUCTION ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader'],
        }) : [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader' },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
  devtool: PRODUCTION ? 'source-map' : 'eval',
  devServer: {
    publicPath: 'http://localhost:8080/build/',
  },
  plugins: PRODUCTION ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false,
      },
    }),
  ].concat(commonPlugins) : [
    // add development plugins here
  ].concat(commonPlugins),
};
