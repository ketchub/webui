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
const express         = require('express');
const webpack         = require('webpack')(require('./webpack.config'));
const spawn           = require('child_process').spawn;
const config          = {
  package: require(dirPath('./package.json')),
  envIs(_env) { return process.env.NODE_ENV === _env; },
  getEnvVar(_env) { return process.env[_env]; }
}
const autoBuildIndexQueue = [];

function dirPath(_path) {
  return `/${path.join(path.basename(__dirname), _path || '')}`;
}

function handleError(err) {
  gulpUtil.log(err.message);
  this.emit('end');
}

// autoBuildIndexJsFiles is *blocking* and waits for the next tick to see if any
// results are placed into the autoBuildIndexQueue by the watch task - in which
// case it will ensure that any writes to the file system are completed BEFORE
// webpack gets invoked
gulp.task('autoBuildIndexJsFiles', _autoBuildIndexJsFiles);
gulp.task('webpack', ['autoBuildIndexJsFiles'], _webpack);
gulp.task('sass', _sass);
gulp.task('html', _html);
gulp.task('assets', _assets);
gulp.task('startLiveReload', _startLiveReload);
gulp.task('express', _express);

gulp.task('default', [
  'webpack',
  'sass',
  'html',
  'assets',
  'startLiveReload',
  'express'
], () => {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/assets/**', ['assets']);
  gulp.watch('src/**/*.js', ['webpack'])
    .on('change', (ev) => {
      if (ev.type === 'changed') { return; }
      autoBuildIndexQueue.push(ev);
    });
});

/**
 * Handler for invoking the gen-indexes bin script to automatically
 * recreate index.js files in directories where .autogen-index files
 * exist.
 */
function _autoBuildIndexJsFiles( callback ) {
  setImmediate(() => {
    if ( !!autoBuildIndexQueue.length ) {
      let i;
      while(i = autoBuildIndexQueue.shift()) {
        gulpUtil.log(`Processing gen-indexes queue: `, i);
      }
      const proc = spawn('node', [dirPath('./bin/gen-indexes')]);
      proc.stdout.on('data', (data) => { gulpUtil.log(`${data}`); });
      proc.stderr.on('data', (data) => {
        gulpUtil.log(`\n\n Index AutoGeneration Error: \n\n`, data);
      });
      proc.on('error', function(err) {
        console.log(`Error regenerating indexes: ${e.message}\n`);
      });
      proc.on('close', (code) => {
        console.log(`Generate Indexes exited with code: ${code}.\n`);
        callback();
      });
      return;
    }
    callback();
  });
}

/**
 * Initialize live reload.
 */
function _startLiveReload() {
  gulpLiveReload.listen();
  gulpUtil.log(gulpUtil.colors.green.bold('-- LIVERELOAD STARTED --'));
}

/**
 * Initialize express web server.
 */
let expressApp;
function _express( callback ) {
  if (!expressApp) {
    expressApp = express();
    expressApp.use(express.static(dirPath('./_dist')));
    expressApp.get('/*', (req, res) => {
      res.sendFile(dirPath('./_dist/index.html'));
    });
    expressApp.listen(8080, () => {
      gulpUtil.log('-- EXPRESS LISTENING ON PORT 8080 --');
      callback();
    });
  }
}

/**
 * Copy assets folder.
 */
function _assets() {
  return gulp.src(dirPath('./src/assets/**/*'))
    .pipe(gulp.dest(dirPath('./_dist')));
}

/**
 * Compile SASS files.
 */
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

/**
 * Build javascript.
 */
function _webpack( callback ) {
  webpack.run((err, stats) => {
    if( err ){
      return callback(
        new gulpUtil.PluginError('webpack:error', err, {showStack:true})
      );
      // throw new gulpUtil.PluginError('webpack:error', err, {showStack:true});
      // return callback(err);
    }
    gulpUtil.log(stats.toString({colors:true, chunks:false}));
    gulpLiveReload.reload();
    callback();
  });
}

/**
 * Build static HTML with templates compiled in.
 */
function _html() {
  const scripts = ['/app.js'];
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
    .pipe(gulpTemplate(_.extend({}, config, { scripts })))
    .on('error', handleError)
    .pipe(gulp.dest('./_dist'))
    .pipe(gulpLiveReload());
}
