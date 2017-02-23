const testMatch = /\.jsx$/;
const excludeMatch = /node_modules/;

module.exports = {
    entry: './client.js',
    output: {
        path: './public',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: testMatch,
                exclude: excludeMatch,
                loader: 'eslint-loader',
            },
            {
                test: testMatch,
                exclude: excludeMatch,
                loader: 'babel-loader',
                query: {
                    presets: ['react'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    }
};

/*
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './client.js',
    output: {
        filename: 'bundle.js',
        path: 'public'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin('public/styles.css')
    ]
};
    */
