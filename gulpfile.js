/*-------------------------------------------------------------------
  Required plugins
-------------------------------------------------------------------*/

var gulp = require('gulp'),
    // path to package.json
    pkg = require('./package.json'),
    // reload browser
    browserSync = require('browser-sync').create(),
    // load gulp plugins
    plugins = require('gulp-load-plugins')(),
    // use postcss with autoprefixer
    autoprefixer = require('autoprefixer');

/*-------------------------------------------------------------------
  Configuration
-------------------------------------------------------------------*/

var path = {

  coffee: "./assets/coffeescript",
  images: "./assets/images",
  jade: "./assets/jade",
  javascript: "./assets/javascript",
  stylus: "./assets/stylus",

  html: "./dist/",
  css: "./dist/css",
  js: "./dist/js",
  img: "./dist/img"

};

var copyFiles = [
    './assets/.htaccess',
    './assets/humans.txt',
    './assets/robots.txt'
    ];

var watched = {
  stylus: path.stylus + '/**/*.styl',
  js: path.javascript + '/**/*.js',
  jade: path.jade + '/**/*.jade',
  img: path.images + '/*'
};

var consoleErorr = function(err) {
  plugins.util.beep();
  console.log(err.message);
};

/*------DEV TASKS------*/

// imagemin
gulp.task('imagemin', function() {
  gulp.src(watched.img)
    .pipe(plugins.imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(path.img));
});

// scripts
gulp.task('js', function() {
  gulp.src(['./assets/libs/jquery/dist/jquery.min.js', './assets/javascript/plugins/*.js', './assets/javascript/main.js'])
    .pipe(plugins.plumber({
      errorHandler: consoleErorr
      }))
    .pipe(plugins.concat('app.min.js'))
    .pipe(gulp.dest(path.js))
    .pipe(browserSync.reload({
      stream:true
    }));
});

// Jade
gulp.task('jade', function() {
  gulp.src(path.jade+'/*.jade')
    .pipe(plugins.plumber({
      errorHandler: consoleErorr
      }))
    .pipe(plugins.jade({pretty: true}))
    .pipe(gulp.dest(path.html))
    .pipe(browserSync.reload({
      stream:true
    }));
});

// Stylus
gulp.task('stylus', function() {
  gulp.src(path.stylus+'/index.styl')
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.stylus())
    .pipe(plugins.plumber({
      errorHandler: consoleErorr
      }))
    .pipe(plugins.concat('index.css'))
    .pipe(plugins.postcss([ autoprefixer( { browsers: ['last 2 versions'] }) ]))
    .pipe(plugins.minifyCss())
    .pipe(plugins.sourcemaps.write('.'))
    .pipe(gulp.dest(path.css));
    // .pipe(browserSync.stream());
});

// Static server
gulp.task('browser-sync', function() {
  browserSync.init({
  	files: ['./dist/**/*'],
    server: {
      baseDir: "./dist"
    }
  });
});

gulp.task('copy', function() {
  gulp.src(copyFiles)
    .pipe(gulp.dest(path.html));
});

// compress files
gulp.task('compress', function () {
  return gulp.src(path.html + '/**/*')
    .pipe(plugins.zip(pkg.name +'_'+ pkg.version +'.zip')) // cjs-template_0.0.8.zip
    .pipe(gulp.dest('./'));
});

// Watcher
gulp.task('server', ['browser-sync'], function() {

  // watch jade
  gulp.watch(watched.jade, ['jade']);

  // watch stylus
  gulp.watch(watched.stylus, ['stylus'], browserSync.reload);

  // watch JavaScript
  gulp.watch(watched.js, ['js']);

});

gulp.task('build', [
  'jade',
  'stylus',
  'imagemin',
  'copy',
  'compress'
]);