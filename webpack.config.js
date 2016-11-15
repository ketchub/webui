const _         = require('lodash');
const fs        = require('fs');
const path      = require('path');
const webpack   = require('webpack');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const context   = path.join(__dirname);
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
const jshint = {
  emitErrors: false,
  failOnHint: true
};

module.exports = {
  development: {
    jshint,
    resolve,
    context,
    devtool: 'eval',
    module: modules,
    entry: path.join(__dirname, 'src/js/_entry.js'),
    output: {
      path: path.join(__dirname, '_dist', process.env.NODE_ENV),
      filename: 'app.js',
      pathinfo: true
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development')
        }
      })
    ]
  },

  test: {
    jshint,
    resolve,
    context,
    module: modules,
    entry: path.join(__dirname, 'test/_entry.js'),
    output: {
      path: path.join(__dirname, '_dist'),
      filename: 'test-bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('test')
        }
      })
    ]
  },

  production: {
    jshint,
    resolve,
    context,
    devtool: 'source-map',
    module: modules,
    entry: path.join(__dirname, 'src/js/_entry.js'),
    output: {
      path: path.join(__dirname, '_dist', process.env.NODE_ENV),
      filename: 'app.min.js'
    },
    // @todo: figure out a way to output both minified/unminified versions
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        }
      })
    ]
  }
};
