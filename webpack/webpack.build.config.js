'use strict';

// Hack for Ubuntu on Windows: interface enumeration fails with EINVAL, so return empty.
// try {
//     require('os').networkInterfaces()
// } catch (e) {
//     require('os').networkInterfaces = () => ({})
// }

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const path = require('path');

const testMatch = /\.jsx?$/;
const excludeMatch = /node_modules/;

const settings = {
  entry: {
    app: path.resolve(__dirname, 'build.js')
  },
  output: {
    path: path.resolve(__dirname, '../build'),
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'commonjs-module'
  },
  resolve: {
    alias: {
      'scss': path.resolve(__dirname, '../src/scss'),
      'react': path.resolve(__dirname, '../node_modules/react'),
      'react-dom': path.resolve(__dirname, '../node_modules/react-dom')
    }
  },
  module: {
    rules: [
      // {
      //     enforce: 'pre',
      //     test: testMatch,
      //     exclude: excludeMatch,
      //     loader: 'eslint-loader',
      // },
      {
        test: testMatch,
        exclude: excludeMatch,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime']
        }
      }
    ]
  },
  plugins: [
  ]
};

module.exports = settings;
