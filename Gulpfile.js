const _               = require('lodash');
const gulp            = require('gulp');
const path            = require('path');
const fs              = require('fs');
const glob            = require('glob');
const gulpSass        = require('gulp-sass');
const gulpUtil        = require('gulp-util');
const gulpSourceMaps  = require('gulp-sourcemaps');
const gulpInception   = require('gulp-inception');
const gulpLiveReload  = require('gulp-livereload');
const gulpTemplate    = require('gulp-template');
const gulpHtmlMin     = require('gulp-htmlmin');
const express         = require('express');
const compression     = require('compression');
const webpackConfigs  = require('./webpack.config');
const webpack         = require('webpack')(webpackConfigs[process.env.NODE_ENV]);
const webpackTests    = require('webpack')(webpackConfigs["test"]);
const spawn           = require('child_process').spawn;
const autoBuildIndexQueue = [];
const DEST_PATH = dirPath(`./_dist/${process.env.NODE_ENV}`);

function envIs(_env) {
  return process.env.NODE_ENV === _env;
}

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
gulp.task('webpack-tests', _webpackTests);
gulp.task('sass', _sass);
gulp.task('html', _html);
gulp.task('assets', _assets);
gulp.task('startLiveReload', _startLiveReload);
gulp.task('express', _express);
gulp.task('build-production', ['webpack', 'sass', 'html', 'assets'], () => {
  gulpUtil.log('Release Complete');
});
gulp.task('serve-production', ['build-production', 'express'], (cb) => {
  // to keep gulp from "completing", we pass a callback but never invoke it
  gulpUtil.log('Serving Production');
});

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
  gulp.watch('test/**/*.test.js', ['webpack-tests'])
    .on('change', (ev) => {
      if (ev.type === 'changed') { return; }
      _createTestManifest();
    });
  // reload css files without refreshing entire page
  gulp.watch('_dist/development/*.css', (file) => {
    gulpLiveReload.changed(file);
  });
});

/**
 * Generate the manifest file for tests directory.
 */
function _createTestManifest() {
  const manifestFilePath = dirPath('./test/manifest.js');
  glob('./**/*.test.js', {
    cwd: dirPath('./test')
  }).on('end', (filePaths) => {
    let writeStream = fs.createWriteStream(manifestFilePath);
    writeStream.write(`/* WARNING: do not edit this manually; run '$: make dev' and let the task runner create. */\n\n`);
    filePaths.forEach(( filePath ) => {
      writeStream.write(`require('${filePath}');\n`);
    });
    writeStream.on('close', () => {
      gulpUtil.log('\nTest Directory manifest.js updated.\n');
    }).end();
  });
}

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
      makeIndexFiles('./src/js/**/*.autogen-index', callback);
      return;
      // const proc = spawn('node', [dirPath('./bin/gen-indexes')]);
      // proc.stdout.on('data', (data) => { gulpUtil.log(`${data}`); });
      // proc.stderr.on('data', (data) => {
      //   gulpUtil.log(`\n\n Index AutoGeneration Error: \n\n`, data);
      // });
      // proc.on('error', function(err) {
      //   console.log(`Error regenerating indexes: ${e.message}\n`);
      // });
      // proc.on('close', (code) => {
      //   console.log(`Generate Indexes exited with code: ${code}.\n`);
      //   callback();
      // });
      // return;
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
    expressApp.use(compression()); // we want to see how big files will actually be when gzipped
    expressApp.use(express.static(DEST_PATH));
    expressApp.use(express.static(dirPath('./node_modules/mocha')));
    expressApp.get('/test', (req, res) => {
      res.sendFile(dirPath('./test/index.html'));
    });
    expressApp.get('/test-bundle.js', (req, res) => {
      res.sendFile(dirPath('./_dist/test-bundle.js'));
    });
    expressApp.get('/*', (req, res) => {
      gulpUtil.log('__ serving index.html __');
      res.sendFile(`${DEST_PATH}/index.html`);
    });
    expressApp.listen(8080, '0.0.0.0', () => {
      gulpUtil.log(`-- EXPRESS LISTENING ON PORT 8080 --`);
      gulpUtil.log(`-- SERVING ROOT: ${DEST_PATH} --`);
      callback();
    });
  }
}

/**
 * Copy assets folder.
 */
function _assets() {
  return gulp.src(dirPath('./src/assets/**/*'))
    .pipe(gulp.dest(DEST_PATH));
}

/**
 * Compile SASS files.
 */
function _sass() {
  return gulp.src(dirPath('./src/scss/app.scss'))
    .pipe(gulpSourceMaps.init())
    .pipe(gulpSass({
      outputStyle: envIs('production') ? 'compressed' : 'nested',
      includePaths: [
        './node_modules'
      ]
    }).on('error', gulpSass.logError))
    .pipe(gulpSourceMaps.write('./'))
    .pipe(gulp.dest(DEST_PATH));
    // .pipe(gulpLiveReload());
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
    }
    gulpUtil.log(stats.toString({colors:true, chunks:false}));
    gulpLiveReload.reload();
    callback();
  });
}

/**
 * Build tests with webpack.
 */
function _webpackTests( callback ) {
  webpackTests.run((err, stats) => {
    if (err) {
      return callback(
        new gulpUtil.PluginError('webpack:error', err, {showStack:true})
      );
    }
    gulpUtil.log(stats.toString({colors:true, chunks:false}));
    callback();
  });
}

/**
 * Build static HTML with templates compiled in.
 */
function _html() {
  const scripts = [];
  if (envIs('development')) {
    scripts.push('/app.js');
    scripts.push('//localhost:35729/livereload.js?snipver=1');
  }
  if (envIs('production')) {
    scripts.push('/app.min.js');
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
      },
      pipeThrough: gulpHtmlMin({collapseWhitespace:true, removeComments:true})
    }))
    .pipe(gulpTemplate(_.extend({}, config, { scripts })))
    .pipe(gulpHtmlMin({collapseWhitespace:true, removeComments:true}))
    .on('error', handleError)
    .pipe(gulp.dest(DEST_PATH))
    .pipe(gulpLiveReload());
}

/**
 * Generate index.js files for directories matching the query.
 * @return {void}
 */
function makeIndexFiles(query, callback) {
  const globQuery = path.join(__dirname, query);

  try {
    glob(globQuery, {dot:true}).on('end', function( fileList ){
      fileList.forEach(makeIndexForFilesInDirectory);
    });
    callback();
  } catch(err) {
    callback(err);
  }

  /**
   * Given a directory that contains .autogenerate-index, inspect the directory
   * for what should be exported and create an index.js file.
   * @param  {string} fileName Full path to .autogenerate-index file
   * @return {void}
   */
  function makeIndexForFilesInDirectory( fileName ){
    let dirBasePath   = path.parse(fileName).dir,
        dirGlobQuery  = path.join(dirBasePath, '/**/*.js'),
        indexFilePath = path.join(dirBasePath, 'index.js');

    glob(dirGlobQuery, {ignore: indexFilePath}).on('end', function( filesInDir ){
      var writeStream = fs.createWriteStream(indexFilePath);
      writeHeader(writeStream);

      filesInDir.forEach(function( memberFilePath ){
        var fileInfo    = path.parse(memberFilePath),
            relPath     = memberFilePath.replace(`${dirBasePath}/`, ''),
            exportName  = getExportAsName(relPath.split('/'), fileInfo.name);
        writeStream.write(`export {default as ${exportName}} from './${relPath}';\n`);
      });

      writeStream.on('close', function(){
        console.log(`OK: index.js file auto-generated for ${dirBasePath}`);
      }).end();
    });
  }


  /**
   * Given pathSplitBySlash (eg. '/yolo.js' -> ['yolo.js'], or '/one/two.js' ->
   * ['one', 'two.js']), this will return a camel-cased name for the module
   * export.
   * @param  {array} pathSplitBySlash   Created by string.split('/')
   * @param  {Object} baseName          Given "myFile.js" -> "myFile" is baseName
   * @return {string}
   */
  function getExportAsName( pathSplitBySlash, baseName ){
    // remove (and discard) the last element from the array
    pathSplitBySlash.pop();
    // now check the array length; if its zero, we can just return the basename
    if( pathSplitBySlash.length === 0 ){ return baseName; }
    // if we're here, we need to do camel-casing; first thing, add baseName
    pathSplitBySlash.push(baseName);
    // camelcase things in the array and return joined string
    return pathSplitBySlash.map(function(string, index){
      return index === 0 ? string :
        (string.charAt(0).toUpperCase() + string.slice(1));
    }).join('');
  }


  /**
   * Write header text to the file.
   * @param  {stream} stream Writable stream for the file.
   * @return {void}
   */
  function writeHeader( stream ){
    stream.write(`/* WARNING: AUTO GENERATED BY GULP: do not edit this file manually. */\n\n`);
  }
}
