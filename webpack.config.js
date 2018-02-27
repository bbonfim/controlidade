var path = require('path');

var node_dir = __dirname + '/node_modules';

module.exports = {
    entry: {
        index: './src/main/js/app.js',
        search: './src/main/js/search.js',
        dashboard: './src/main/js/dashboard.js'
    },

    devtool: 'sourcemaps',
    cache: true,
    debug: true,
    output: {
        path: __dirname,
        filename: './src/main/resources/static/built/[name]-bundle.js'
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, '.'),
                exclude: /(node_modules)/,
                loader: 'babel-loader',
                query: {
                    cacheDirectory: true,
                    presets: ['es2015', 'react']
                }
            }
        ]
    }
};