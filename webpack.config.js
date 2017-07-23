const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const commonPlugins = [
  new webpack.optimize.ModuleConcatenationPlugin(),
  new HtmlWebpackPlugin({
    template: 'app/index.html',
  }),
  new ExtractTextPlugin({
    filename: '[name].bundle.css?build=[hash]',
    disable: false,
    allChunks: true,
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
      filename: '[name].bundle.js?build=[hash]',
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
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            plugins: [
              'emotion/babel',
              'transform-react-inline-elements',
              ['transform-runtime', { helpers: false, polyfill: false }],
            ],
            presets: [
              ['env', { targets: { browsers: ['safari >= 10'], uglify: true } }], // 100% ES2015
              'react',
            ],
          },
        },

        // css
        {
          test: /\.css$/,
          exclude: /emotion\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
              loader: 'css-loader',
              options: {
                sourceMap: PRODUCTION,
                modules: true,
              },
            },
          }),
        },

        // emotion.css
        {
          test: /emotion\.css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: {
              loader: 'css-loader',
              options: {
                sourceMap: PRODUCTION,
              },
            },
          }),
        },

        // fonts
        {
          test: /\.(woff(2)?|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=static/[name].[ext]',
        },

        // sass
        {
          test: /\.scss$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'postcss-loader', 'sass-loader'],
          }),
        },
      ],
    },
    devtool: PRODUCTION ? 'source-map' : 'eval',
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
};
