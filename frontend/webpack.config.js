var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:3000',
        'webpack/hot/only-dev-server',
        './src'
    ],
    devServer: {
        hot: true,
        inline:true,
        port: 3000,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    output: {path: __dirname, filename: 'dist/bundle.js'},
    resolve: {
        modulesDirectories: ['node_modules', 'src', 'components'],
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {
                test: /\.css$/,
                loader:'style!css!'
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};