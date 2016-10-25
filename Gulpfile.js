process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const _               = require('lodash');
const gulp            = require('gulp');
const path            = require('path');
const gulpSass        = require('gulp-sass');
const gulpUtil        = require('gulp-util');
const gulpSourceMaps  = require('gulp-sourcemaps');
const gulpInception   = require('gulp-inception');
const gulpLiveReload  = require('gulp-livereload');
const gulpTemplate    = require('gulp-template');
const webpack         = require('webpack')(require('./webpack.config'));
const config          = {
  package: require(dirPath('./package.json')),
  envIs(_env) { return process.env.NODE_ENV === _env; },
  getEnvVar(_env) { return process.env[_env]; }
}

function dirPath(_path) {
  return `/${path.join(path.basename(__dirname), _path || '')}`;
}

function handleError(err) {
  gulpUtil.log(err.message);
  this.emit('end');
}

gulp.task('webpack', _webpack);
gulp.task('sass', _sass);
gulp.task('html', _html);
gulp.task('prior', () => {
  gulpLiveReload.listen();
  gulpUtil.log(gulpUtil.colors.green.bold('LiveReload started'));
});
gulp.task('default', ['prior'], () => {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', ['webpack']);
  gulp.watch('src/**/*.html', ['html']);
});

function _sass() {
  return gulp.src(dirPath('./src/scss/app.scss'))
    .pipe(gulpSourceMaps.init())
    .pipe(gulpSass({
      outputStyle: config.envIs('production') ? 'compressed' : 'nested',
      includePaths: [
        './node_modules'
      ]
    }).on('error', gulpSass.logError))
    .pipe(gulpSourceMaps.write('./'))
    .pipe(gulp.dest(dirPath('./_dist')))
    .pipe(gulpLiveReload());
}

function _webpack( callback ) {
  webpack.run((err, stats) => {
    if( err ){
      throw new gulpUtil.PluginError('webpack:error', err);
    }
    gulpUtil.log(stats.toString({colors:true, chunks:false}));
    gulpLiveReload.reload();
    callback();
  });
}

function _html() {
  const scripts = [
    '/app.js'
  ];
  if (config.envIs('development')) {
    scripts.push('//localhost:35729/livereload.js?snipver=1');
  }

  return gulp.src(dirPath('./src/index.html'))
    .pipe(gulpInception({
      files: ['./src/views/**/*.html'],
      attributes: {
        type: 'text/x-template',
        id( fileInfo ) {
          return path.join(
            fileInfo.dir.replace(dirPath('./src/views'), '/'),
            fileInfo.name
          ).replace('/', '').replace(/\//g, "_");
        }
      }
    }))
    .pipe(gulpTemplate(_.extend({}, config, {
      scripts
    })))
    .on('error', handleError)
    .pipe(gulp.dest('./_dist'))
    .pipe(gulpLiveReload());
}
