var webpack = require('webpack');
var timestamp = (new Date()).valueOf();
module.exports = {
    entry: "./js/index.js",
    output: {
        path: "./js/webpack",
        filename: "bundle"+timestamp+".js"
        //filename: "bundle.js"
    },
    // entry: {
    //     bundle: './js/webpack',
    //     vendor: ['react']
    // },
    // plugins: [
    //     // new webpack.optimize.CommonsChunkPlugin('vendor',  'vendor.js'),
    //     new webpack.optimize.UglifyJsPlugin({
    //         compress: {
    //             warnings: false
    //         }
    //     })
    // ],
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            },
            {
                test: /\.styl$/,
                loader: "style!css!stylus-loader"
            },
            {
                test: /\.js$/,
                loader: "babel",
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
};