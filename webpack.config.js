var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var config = require('./config');

var webpackConfig = {
    entry: [
        './src/index.js'
    ],
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/'
    },
    module: {
        rules: [
            /*
            * Necessary to be able to use angular 1 with webpack as explained in https://github.com/webpack/webpack/issues/2049
            */
            {
                test: require.resolve('angular'),
                use: ['exports-loader?window.angular']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: ['babel-loader']
            },
            {
                test: /\.html$/,
                exclude: path.resolve(__dirname, './src/index.html'),
                use: ['file-loader']
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract({
                    fallback: [{
                        loader: 'style-loader',
                    }],
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'less-loader'
                    }]
                })
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            'global': 'window',
            'process.env.NODE_ENV': JSON.stringify(config.NODE_ENV)
        }),
        new webpack.ProvidePlugin({
            angular: 'angular',
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: true
        }),
        new ExtractTextPlugin('bundle.css')
    ],
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        historyApiFallback: {
            index: '/',
            disableDotRule: true
        }
    }
};

module.exports = webpackConfig;
