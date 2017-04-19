const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

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
    template: path.resolve(__dirname, '../src/webapp/templates/manifest.json'),
    filename: '../static-low-cache/manifest.json',
    inject: false
  }),
  new HtmlWebpackPlugin({
    template: path.resolve(__dirname, '../src/webapp/templates/browserconfig.xml'),
    filename: '../static-low-cache/browserconfig.xml',
    inject: false
  }),
  // new HtmlWebpackPlugin({
  //   template: path.resolve(__dirname, '../src/webapp/templates/sw.js'),
  //   filename: '../static-low-cache/sw.js',
  //   inject: false
  // }),
  new ManifestPlugin({
    fileName : '../assets-manifest.json'
  })
);

// CSS with hash
config.plugins.push(
  new ExtractTextPlugin('[contenthash].[name].css')
);

// minify the code
config.plugins.push(new Webpack.optimize.UglifyJsPlugin({
  compress: {
    drop_console: true,
  }
}));
config.plugins.push(new OptimizeCssAssetsPlugin());

module.exports = config;