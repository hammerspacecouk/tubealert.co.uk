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

// images now get hashed
config.module.rules.push({
    test: /\.(png|svg)$/,
    loader: 'file-loader?name=[hash].[name].[ext]'
});

config.plugins.push(
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/index.html'),
        filename: path.resolve(__dirname, 'public/html/index.html'),
        xhtml: true
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/manifest.json'),
        filename: path.resolve(__dirname, 'public/html/manifest.json'),
        inject: false
    }),
    new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'templates/browserconfig.xml'),
        filename: path.resolve(__dirname, 'public/html/browserconfig.xml'),
        inject: false
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