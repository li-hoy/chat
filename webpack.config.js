const { VueLoaderPlugin } = require('vue-loader');

const path = require('path');

module.exports = {
    entry: './main/assets/js/index.js',
    module: {
        rules: [
            // { test: /\.svg$/, use: 'svg-inline-loader' },
            { test: /\.css$/, use: ['vue-style-loader', 'css-loader'] },
            { test: /\.js$/, use: 'babel-loader' },
            { test: /\.vue$/, use: 'vue-loader' }
        ]
    },
    optimization: {
        minimize: false
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        },
    },
    output: {
        path: path.resolve(__dirname, 'main/static/js'),
        filename: 'index.js'
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    plugins: [
        new VueLoaderPlugin()
    ]
}