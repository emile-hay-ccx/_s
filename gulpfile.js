/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass');

// create a default task and just log a message
gulp.task('default', function() {
    return gutil.log('Gulp is running!')
});

gulp.task('sass', function(){
    return gulp.src('sass/style.scss')
        .pipe(sass()) // Using gulp-sass
        .pipe(gulp.dest('style.css'))
});

// Gulp watch syntax
gulp.watch('sass/**/*.scss', ['sass']);