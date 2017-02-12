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