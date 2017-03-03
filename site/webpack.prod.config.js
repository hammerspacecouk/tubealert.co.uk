'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const config = require('./webpack.base.config.js');

// add hashes into filenames
config.output.filename ='[chunkhash].[name].js';

// ensure we are production mode (for react etc)
config.plugins.push(
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('production')
        }
    })
);

// CSS with hash
config.plugins.push(
    new ExtractTextPlugin('[contenthash].[name].css')
);

// minify the code
config.plugins.push(new webpack.optimize.UglifyJsPlugin());
config.plugins.push(new OptimizeCssAssetsPlugin());

module.exports = config;