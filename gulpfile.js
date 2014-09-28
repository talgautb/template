/*-------------------------------------------------------------------
	Required plugins
-------------------------------------------------------------------*/

var gulp = require('gulp'),
	// css preprocessing
	stylus = require('gulp-stylus'),
	// autoprefixer for vendors
	autoprefixer = require('gulp-autoprefixer'),
	// minify css files
	minifycss = require('gulp-minify-css'),
	// compiled js files
	coffee = require('gulp-coffee'),
	// compiled js files
	jade = require('gulp-jade'),
	// uglify js files
	uglify = require('gulp-uglify');
	// concat files
	concat = require('gulp-concat');

/*-------------------------------------------------------------------
	Configuration
-------------------------------------------------------------------*/

var path = {

	stylus: "assets/stylus",
	coffee: "assets/coffee",
	jade: "assets/jade",

	html: "dist/",
	css: "dist/css",
	js: "dist/js"

	//img: "assets/img"
};

var watched = {
	stylus: path.stylus + '/**/*.styl',
	coffee: path.coffee + '/**/*.coffee',
	jade: path.jade + '/**/*.jade'
	//img: path.img + '/**/*',
};

/*------DEV TASKS------*/

// Coffee
gulp.task('coffee', function() {
	gulp.src(watched.coffee)
		.pipe(coffee({bare: true}))
		.pipe(concat('app.js'))
		.pipe(uglify({mangle: true}))
		.pipe(gulp.dest(path.js));
});

// Jade
gulp.task('jade', function() {
	gulp.src(path.jade+'*.jade')
		.pipe(jade({pretty: true,}))
		.pipe(gulp.dest(path.html));
});

// Stylus
gulp.task('stylus', function() {
    gulp.src(watched.stylus)
		.pipe(stylus({
			// use: nib(),
			// import: 'nib'
		}))
		.on('error', console.log)
		.pipe(concat('index.css'))
		.pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
		.pipe(minifycss())
		.pipe(gulp.dest(path.css));
});


// Watcher
gulp.task('watch', function() {
	// Create file on init
	//gulp.run('stylus');
	//gulp.run('coffee');
	//gulp.run('jade');

	// watch jade
	gulp.watch(watched.jade, ['jade']);

	// watch stylus
	gulp.watch(watched.stylus, ['stylus']);

	// watch coffee
	gulp.watch(watched.coffee, ['coffee']);

});