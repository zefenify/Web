const webpack = require('webpack');

const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.php',
      filename: 'index.php',
      minify: {
        collapseInlineTagWhitespace: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true,
      },
    }),
  ],
});
