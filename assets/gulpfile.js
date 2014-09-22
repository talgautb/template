var gulp = require('gulp'),
	//nib = require('nib'),
	stylus = require('gulp-stylus'),
	coffee = require('gulp-coffee'),
	jade = require('gulp-jade'),
	concat = require('gulp-concat');


// Coffee
gulp.task('coffee', function() {
	gulp.src('coffee/*.coffee')
		.pipe(coffee({bare: true}).on('error', console.log))
		.pipe(concat('app.js'))
		.pipe(gulp.dest('../js'));
});

// Jade
gulp.task('jade', function() {
	gulp.src('jade/*.jade')
		.pipe(jade({
			// config
		}))
		.pipe(gulp.dest('../'));
});

// Stylus
gulp.task('stylus', function() {
    gulp.src('stylus/index.styl')
		.pipe(stylus({
			// use: nib(),
			// import: 'nib'
		}))
		.on('error', console.log)
		.pipe(gulp.dest('../css'));
});


// Watcher
gulp.task('watch', function() {
	// Create file on init
	//gulp.run('stylus');
	//gulp.run('coffee');
	//gulp.run('jade');

	// watch jade
	gulp.watch('jade/**/*.jade', function() {
		gulp.run('jade');
	});

	// watch stylus
	gulp.watch('stylus/**/*.styl', function() {
		gulp.run('stylus');
	});

	// watch coffee
	gulp.watch('coffee/*.coffee', function() {
		gulp.run('coffee');
	});
});