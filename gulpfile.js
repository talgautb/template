// Builder
const gulp = require('gulp');
const watch = require('gulp-watch');
// PostCSS
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
// Tools
const browserSync = require('browser-sync');
const stylus = require('gulp-stylus');
const pug = require('gulp-pug');
const util = require('gulp-util');
const plumber = require('gulp-plumber');

const babel = require('gulp-babel');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

const imagemin = require('gulp-imagemin');
const zip = require('gulp-zip');

const pkg = require('./package.json');

/**
 * Constants
 */
const path = {
  stylus: {
    main: './src/stylus/main.styl',
    files: './src/stylus/**/*.styl',
  },
  img: './src/img/**/*.{jpg,png,svg,gif}',
  js: './src/js/**/*.js',
  styles: './dist/styles/',
  pug: './src/*.pug'
};

const copyFiles = [
  './src/.htaccess',
  './src/*.txt',
  './src/*.json'
  ];

let consoleErorr = (err) => {
  util.beep();
  console.log(err.message);
};

/**
 * Styles
 */
gulp.task('style', () => {
  // PostCSS plugins
  const postcssPlugins = [
    autoprefixer({ browsers: ['> 1%', 'ie >= 9'] })
  ];

  return gulp.src(path.stylus.main)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(stylus())
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.styles));
});


gulp.task('styleBuild', () => {
  // PostCSS plugins
  const postcssPlugins = [
    autoprefixer({ browsers: ['> 1%', 'ie >= 9'] })
  ];

  return gulp.src(path.stylus.main)
    .pipe(plumber())
    .pipe(stylus())
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(path.styles));
});

/**
 * pug
 */
gulp.task('pug', () => {
  return gulp.src(path.pug)
    .pipe(plumber({
      errorHandler: consoleErorr
      }))
    .pipe(pug())
    .pipe(gulp.dest('./dist'));
});

// JS
gulp.task('js', () => {
  return gulp.src(path.js)
    .pipe(plumber({
      errorHandler: consoleErorr
      }))
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./dist/js/'));
});

// IMG
gulp.task('imagemin', function() {
  gulp.src(path.img)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest('./dist/img/'));
});

// Copy others files
gulp.task('copy', function() {
  gulp.src(copyFiles)
    .pipe(gulp.dest('./dist/'));
});

// compress files
gulp.task('compress', function () {
  return gulp.src('.dist/**/*')
    .pipe(zip(pkg.name +'_'+ pkg.version +'.zip')) // template_2.X.X.zip
    .pipe(gulp.dest('./'));
});

/**
 * Gulp tasks:
 *
 * gulp start
 * gulp build
 * gulp zip
 */
gulp.task('start', ['pug', 'style', 'js', 'imagemin'], ()=> {
  browserSync.init({
    files: ['./dist/**/*'],
    server: {
      baseDir: "./dist"
    },
    open: false,
    port: 4001,
    ui: false
  });

  watch('./src/stylus/**/*.styl', ()=> {
    gulp.start('style');
  });

  watch('./src/js/**/*.js', ()=> {
    gulp.start('js');
  });

  watch('./src/**/*.pug', ()=> {
    gulp.start('pug');
  });

  watch('./src/img/**/*.{jpg,png,svg}', () => {
    gulp.start('imagemin');
  });
});


gulp.task('build', ['pug', 'styleBuild', 'js', 'imagemin', 'copy', 'compress']);

gulp.task('zip', ['compress']);
