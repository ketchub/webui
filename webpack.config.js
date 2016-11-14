const _         = require('lodash');
const fs        = require('fs');
const path      = require('path');
const webpack   = require('webpack');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const context   = path.join(__dirname);
const output    = {
  path: path.join(__dirname, '_dist'),
  filename: '[name].js',
  pathinfo: true
};
const excludes  = /node_modules/;
const includes  = [
  path.join(__dirname, './src/js'),
  path.join(__dirname, './test')
];
const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.js'
  }
};
const modules = {
  preLoaders: [{
    loader: 'jshint-loader',
    test: /\.js$/,
    exclude: excludes,
    include: includes
  }],
  loaders: [{
    test: /\.js$/,
    loader: 'babel-loader',
    exclude: excludes,
    include: includes,
    query: _.merge({
      cacheDirectory: false
    }, babelRc)
  }]
};
const minifyPlugin = new webpack.optimize.UglifyJsPlugin({
  minimize: true,
  compress: {
    warnings: false
  }
});
const jshint = {
  emitErrors: false,
  failOnHint: true
};

const configs = {
  development: {
    name: 'js',
    entry: {
      app: path.join(__dirname, 'src/js/_entry.js')
    },
    resolve,
    context,
    devtool: 'eval',
    output,
    module: modules,
    jshint
  },

  test: {
    entry: path.join(__dirname, 'test/_entry.js'),
    resolve,
    context,
    output: {
      path: path.join(__dirname, '_dist'),
      filename: '_test-bundle.js'
    },
    module: modules,
    jshint
  },

  production: {
    entry: {
      'app.min': path.join(__dirname, 'src/js/_entry.js')
    },
    resolve,
    context,
    devtool: 'source-map',
    output,
    // @todo: figure out a way to output both minified/unminified versions
    plugins: [ minifyPlugin ],
    module: modules,
    jshint
  }
};

module.exports = configs;
