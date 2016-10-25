const _         = require('lodash');
const fs        = require('fs');
const path      = require('path');
const webpack   = require('webpack');
const babelRc   = JSON.parse(fs.readFileSync('./.babelrc', 'utf8'));
const context   = path.join(__dirname);
const output    = {
  path: path.join(__dirname, '_dist'),
  filename: '[name].js'
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
    name: 'js',
    entry: {
      app: path.join(__dirname, 'src/js/_entry.js')
    },
    templatePartials,
    resolve,
    context,
    devtool: 'source-map',
    output,
    module: modules,
    jshint
  },

  production: {
    entry: {
      'app.min': path.join(__dirname, 'src/js/_entry.js')
    },
    templatePartials,
    resolve,
    context,
    output,
    // @todo: figure out a way to output both minified/unminified versions
    plugins: [ minifyPlugin ],
    module: modules,
    jshint
  }
};

module.exports = configs[process.env.NODE_ENV || "development"];
