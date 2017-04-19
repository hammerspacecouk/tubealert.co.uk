'use strict';

const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const config = require('./webpack.base.config.js');
const path = require('path');

// dev filenames
config.output.filename ='[name].js';

// allow dev server
config.devServer = {
  contentBase: path.resolve(__dirname, '.'),
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  historyApiFallback: {
    index: '/'
  }
};

// load images
config.module.rules.push({
  test: /\.(png|svg)$/,
  loader: 'file-loader?name=[name].[ext]'
});

// add source maps
config.devtool = 'source-map';

config.plugins.push(
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, 'index.html'),
    filename: 'index.html',
  })
);

// CSS without hash during dev
config.plugins.push(
  new ExtractTextPlugin('[name].css')
);

// debug mode
config.plugins.push(
  new Webpack.LoaderOptionsPlugin({
    debug: true
  })
);

module.exports = config;
