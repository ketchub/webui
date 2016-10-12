const fs        = require('fs');
const _         = require('lodash');
const path      = require('path');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const excludes  = new RegExp(`node_modules`);
const includes  = [
  path.join(__dirname, './src/js'),
  path.join(__dirname, './test')
];

module.exports = {
  watch: true,
  context: path.join(__dirname),
  devtool: 'source-map',
  entry: {
    app: path.join(__dirname, 'src/js/_entry.js')
  },
  output: {
    path: path.join(__dirname, '_dist'),
    filename: '[name].js'
  },
  module: {
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
  },
  jshint: {
    emitErrors: false,
    failOnHint: true
  }
};
