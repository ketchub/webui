const fs        = require('fs');
const _         = require('lodash');
const path      = require('path');
const webpack   = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const excludes  = /node_modules/;
const includes  = [
  path.join(__dirname, './src/js'),
  path.join(__dirname, './test')
];

console.log(`Running with NODE_ENV: ${process.env.NODE_ENV}`);

function walkDirSync(dir, fileList) {
  const files = fs.readdirSync(dir);
  fileList = fileList || [];
  files.forEach((file) => {
    if (fs.statSync(`${dir}/${file}`).isDirectory()) {
      fileList = walkDirSync(`${dir}/${file}`, fileList);
    } else {
      fileList.push(`${dir}/${file}`);
    }
  });
  return fileList;
}

function templatePartials() {
  const dir = path.join(__dirname, './src/views');
  const filePaths = walkDirSync(dir);
  return filePaths.map((fullPath) => {
    return {
      fullPath,
      relativePath: fullPath.substring(dir.length),
      contents: fs.readFileSync(fullPath).toString()
    }
  });
}

const configs = {
  development: {
    templatePartials,
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.js'
      }
    },
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
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          caseSensitive: true
        },
        template: './src/index.html'
      })
    ],
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
          // cacheDirectory: false
        }, babelRc)
      }]
    },
    jshint: {
      emitErrors: false,
      failOnHint: true
    },
    devServer: {
      contentBase: './_dist',
      host: '0.0.0.0',
      port: 8080
    }
  },

  production: {
    templatePartials,
    context: path.join(__dirname),
    entry: {
      app: path.join(__dirname, 'src/js/_entry.js')
    },
    output: {
      path: path.join(__dirname, '_dist'),
      filename: '[name].min.js'
    },
    // @todo: figure out a way to output both minified/unminified versions
    plugins: [
      new HtmlWebpackPlugin({
        inject: false,
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          caseSensitive: true
        },
        template: './src/index.html'
      }),
      new webpack.optimize.UglifyJsPlugin({
        minimize: true,
        compress: {
          warnings: false
        }
      })
    ],
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
  }
};

module.exports = configs[process.env.NODE_ENV || "development"];
