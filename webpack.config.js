const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const BabiliPlugin = require('babili-webpack-plugin');

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
    minChunks: Infinity,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = {
  entry: {
    vendor: [
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'redux',
      'reselect',
      'styled-components',
    ],
    app: ['./app/index.jsx'],
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
  },
  resolve: {
    alias: { app: path.resolve(__dirname, 'app/') },
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
          presets: [
            'react',
            ['env', { targets: { browsers: ['safari >= 10'] } }],
          ],
          env: {
            production: {
              presets: ['babili'],
            },
          },
        },
      },

      // css
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
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
  devtool: PRODUCTION ? 'source-map' : false,
  devServer: {
    compress: true,
    publicPath: 'http://localhost:8080/build/',
  },
  plugins: PRODUCTION ? [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new BabiliPlugin(),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false,
    //   },
    // }),
  ].concat(commonPlugins) : [
    // add development plugins here
  ].concat(commonPlugins),
};
