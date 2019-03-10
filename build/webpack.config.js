const path = require('path')
const WebpackDeepScopeAnalysisPlugin = require('webpack-deep-scope-plugin').default
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const config = require('../config')
const argv = require('yargs-parser')(process.argv.slice(2))
const merge = require('webpack-merge')
const _mode = argv.mode || 'development'
const _mergeConfig = require(`./webpack.${_mode}.config.js`)
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWabpackPlugin = require('clean-webpack-plugin')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

webpackConfig = {
    entry: {
        app: './src/main.js'
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production' ?
            config.build.assetsPublicPath :
            config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('/src'),
        }
    },
    module: {
        rules: [{
                test: /\.css$/,
                use: ['style-loader', {
                    loader: 'css-loader?modules&localIdentName=[name]_[local]-[hash:base64:5]'
                }]
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: 'index.html',
            inject: true
        }),
        // new htmlWebpackPlugin({
        //     filename: './release/index.html',
        //     template: './index.html'
        // }),
        new WebpackDeepScopeAnalysisPlugin()
        // new CleanWabpackPlugin('dist')
    ]
}

module.exports = merge(_mergeConfig, webpackConfig)