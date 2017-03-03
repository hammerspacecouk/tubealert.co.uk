'use strict';

const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const config = require('./webpack.base.config.js');
const path = require('path');

// add hashes into filenames
config.output.filename ='[chunkhash].[name].js';

// ensure we are production mode (for react etc)
config.plugins.push(
    new Webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify('production')
        }
    })
);

config.plugins.push(
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        filename: path.resolve(__dirname, 'public/html/index.html'),
    })
);

// CSS with hash
config.plugins.push(
    new ExtractTextPlugin('[contenthash].[name].css')
);

// minify the code
config.plugins.push(new Webpack.optimize.UglifyJsPlugin());
config.plugins.push(new OptimizeCssAssetsPlugin());

module.exports = config;