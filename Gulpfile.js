process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const gulp            = require('gulp');
const path            = require('path');
const gulpSass        = require('gulp-sass');
const gulpUtil        = require('gulp-util');
const gulpSourceMaps  = require('gulp-sourcemaps');
const gulpInception   = require('gulp-inception');
const webpack         = require('webpack')(require('./webpack.config'));
const dirPath         = function(_path) {
  return `/${path.join(path.basename(__dirname), _path || '')}`;
};
const envIs           = function(_env) {
  return process.env.NODE_ENV === _env;
};

gulp.task('webpack', _webpack);
gulp.task('sass', _sass);
gulp.task('html', _html);
gulp.task('default', () => {
  gulp.watch(dirPath('./src/scss/**/*.scss'), ['sass']);
  gulp.watch(dirPath('./src/js/**/*.js'), ['webpack']);
  gulp.watch(dirPath('./src/views/**/*.html'), ['html']);
});

function _sass() {
  return gulp.src(dirPath('./src/scss/app.scss'))
    .pipe(gulpSourceMaps.init())
    .pipe(gulpSass({
      outputStyle: envIs('production') ? 'compressed' : 'nested'
    }).on('error', gulpSass.logError))
    .pipe(gulpSourceMaps.write('./'))
    .pipe(gulp.dest(dirPath('./_dist')));
}

function _webpack( callback ) {
  webpack.run((err, stats) => {
    if( err ){
      throw new gulpUtil.PluginError('webpack:error', err);
    }
    gulpUtil.log(stats.toString({colors:true, chunks:false}));
    // gulpLiveReload.reload();
    callback();
  });
}

function _html() {
  return gulp.src(dirPath('./src/index.html'))
    .pipe(gulpInception({
      files: ['./src/views/**/*.html'],
      attributes: {
        id( fileInfo ) {
          return path.join(
            fileInfo.dir.replace(dirPath('./src/views'), '/'),
            fileInfo.base
          );
        }
      }
    }))
    .pipe(gulp.dest('./_dist'));
}
