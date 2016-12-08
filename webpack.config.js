const _         = require('lodash');
const fs        = require('fs');
const path      = require('path');
const webpack   = require('webpack');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const package   = require('./package.json');
const context   = path.join(__dirname);
const excludes  = /node_modules/;
const includes  = [
  path.join(__dirname, './src/js'),
  path.join(__dirname, './test')
];
const resolve = {
  alias: {
    'vue$': 'vue/dist/vue.js',
    'modernizr$': path.join(__dirname, './.modernizrrc')
  }
};
const modules = {
  preLoaders: [{
    loader: 'jshint-loader',
    test: /\.js$/,
    exclude: excludes,
    include: includes
  }],
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: excludes,
      include: includes,
      query: _.merge({
        cacheDirectory: false
      }, babelRc)
    },
    {
      test: /\.modernizrrc$/,
      loader: 'modernizr'
    }
  ]
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
    entry: ['whatwg-fetch', path.join(__dirname, 'src/js/app.js')],
    output: {
      path: path.join(__dirname, '_dist', process.env.NODE_ENV),
      filename: 'app.js',
      pathinfo: true
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('development'),
          VERSION: JSON.stringify(package.version)
        }
      })
    ]
  },

  test: {
    jshint,
    resolve,
    context,
    module: modules,
    entry: ['whatwg-fetch', path.join(__dirname, 'test/_entry.js')],
    output: {
      path: path.join(__dirname, '_dist', 'test'),
      filename: 'test-bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('test'),
          VERSION: JSON.stringify(package.version)
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
    entry: ['whatwg-fetch', path.join(__dirname, 'src/js/app.js')],
    output: {
      path: path.join(__dirname, '_dist', process.env.NODE_ENV),
      filename: 'app.min.js'
    },
    // @todo: figure out a way to output both minified/unminified versions
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
          VERSION: JSON.stringify(package.version)
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
