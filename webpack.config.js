const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonPlugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new HtmlWebpackPlugin({
    template: 'app/index.html',
    minify: {
      collapseInlineTagWhitespace: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      removeComments: true,
    },
    hash: true,
  }),
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: Infinity,
  }),
];

module.exports = (env) => {
  const PRODUCTION = env === 'production';

  return {
    entry: {
      vendor: [
        'localforage',
        'axios',
        'react',
        'react-dom',
        'react-redux',
        'react-router',
        'react-router-dom',
        'redux',
        'redux-saga',
        'reselect',
        'emotion',
        'notie',
        'howler',
      ],
      app: ['./app/index.jsx'],
    },
    output: {
      filename: '[name].bundle.js',
      path: path.join(__dirname, './build'),
      publicPath: '/',
    },
    resolve: {
      alias: { '@app': path.resolve(__dirname, './app') },
      extensions: ['.js', '.jsx', '.scss'],
    },
    module: {
      rules: [
        // js[x]
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['emotion/babel', { extractStatic: true }],
                'transform-react-inline-elements',
                'transform-class-properties',
                ['transform-runtime', { helpers: false, polyfill: false }],
              ],
              presets: [
                ['env', { targets: { safari: 10, uglify: true }, useBuiltIns: true, debug: true }], // 100% ES2015
                'react',
              ],
            },
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
              },
            },
          }) : ['style-loader', { loader: 'css-loader', options: { modules: true } }],
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
                modules: true,
              },
            },
          }) : ['style-loader', { loader: 'css-loader' }],
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
          }) : ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
        },
      ],
    },
    devtool: PRODUCTION ? false : 'eval',
    devServer: {
      contentBase: path.resolve(__dirname, './app'),
      publicPath: '/',
      historyApiFallback: true,
    },
    plugins: PRODUCTION ? [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
      new ExtractTextPlugin({
        filename: '[name].bundle.css',
        disable: false,
        allChunks: true,
      }),
      new UglifyJsPlugin(),
    ].concat(commonPlugins) : [
      // add development plugins here
    ].concat(commonPlugins),
  };
};
