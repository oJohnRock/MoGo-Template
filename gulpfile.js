const { src, dest, parallel, series, watch } = require('gulp');
const browserSync   = require('browser-sync').create();
const del           = require('del');
const sass          = require('gulp-sass');
const autoprefixer  = require('gulp-autoprefixer');
const plumber       = require('gulp-plumber');
const uglify        = require('gulp-uglify-es').default;
const imagemin      = require('gulp-imagemin');
const newer         = require('gulp-newer');
const sourceMaps    = require('gulp-sourcemaps');
const rename        = require('gulp-rename');

function serverStart() {
  browserSync.init({
    server: { baseDir: 'app/' },
    notify: false,
    online: true
  });

  watch('app/**/*.html').on('change', browserSync.reload );
  watch('app/scss/**/*', stylesHandler);
  watch(['app/js/**/*.js', '!app/js/**/*.min.js'], scriptsHandler);
  watch('app/img/src/**/*', imgHandler);
}

function stylesHandler() {
  return src('app/scss/**/*.scss')
  .pipe( plumber() )
  .pipe( sourceMaps.init() )
  .pipe( sass({
    outputStyle: 'compressed'
    }) )
  .pipe( autoprefixer({
    overrideBrowserslist: ['last 2 versions'],
    //grid: true
  }) )
  .pipe( rename({
    suffix: '.min'
    }) )
  .pipe( sourceMaps.write('./'))
  .pipe( dest('app/css') )
  .pipe( browserSync.stream() );
}

function scriptsHandler() {
  return src(['app/js/**/*.js', '!app/js/**/*.min.js'])
  .pipe( rename({
    suffix: '.min'
    }) )
  .pipe( uglify() )
  .pipe( dest('app/js') )
  .pipe( browserSync.stream() );
}

function imgHandler() {
  return src('app/img/src/**/*')
  .pipe( newer('app/img/dest') )
  .pipe( imagemin() )
  .pipe( dest('app/img/dest/') );
}

function cleanDist() {
  return del('dist/**/*', { force: true })
}

function build() {
  return src([
    'app/**/*.html',
    'app/css/**/*.min.css',
    'app/js/**/*.min.js'
    ], { base: 'app'})
  .pipe( dest('dist') );
}

exports.build = series(
  cleanDist,
  parallel(
    stylesHandler, 
    scriptsHandler, 
    imgHandler),
  build);

exports.default = series(
  parallel(
    stylesHandler, 
    scriptsHandler, 
    imgHandler),
  serverStart);