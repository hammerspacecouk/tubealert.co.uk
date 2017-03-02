'use strict';

const webpack = require('webpack');
const config = require('./webpack.base.config.js');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// dev filenames
config.output.filename ='[name].js';

// allow dev server
config.devServer = {
    contentBase: path.resolve(__dirname, './public'),
        watchOptions: {
        aggregateTimeout: 300,
            poll: 1000
    },
    historyApiFallback: {
        index: '/'
    }
};

// add source maps
config.devtool = 'source-map';

// CSS without hash during dev
config.plugins.push(
    new ExtractTextPlugin('[name].css')
);

// debug mode
config.plugins.push(
    new webpack.LoaderOptionsPlugin({
        debug: true
    })
);

module.exports = config;
