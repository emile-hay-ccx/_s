require('es6-promise').polyfill();

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    sass = require('gulp-sass'),
    rtlcss = require('gulp-rtlcss'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    browserSync = require('browser-sync').create();

var reload = browserSync.reload;

gulp.task('watch', function() {
    browserSync.init({
        files: ['./**/*.php'],
        proxy: 'http://localhost/xxx/',          // This URL should point to where the site resides
    });
    gulp.watch('sass/**/*.scss', ['sass', reload]);         // Watch for sass changes, if there are any run the sass command.
    gulp.watch('js/*.js', ['js', reload]);                  // Watch for js changes, if there are any run the js command.
    gulp.watch('images/src/*', ['images', reload]);         // Watch for image changes, if there are any run the images command.
});

gulp.task('sass', function() {
    return gulp.src('sass/*.scss')
        .pipe(plumber({ errorHandler: onError }))   // If there is an error, run the onError function
        .pipe(sass())                               // Compile the sass
        .pipe(autoprefixer())                       // Do autoprefixing, yay!
        .pipe(gulp.dest(''))                        // Output LTR stylesheets (style.css)

        .pipe(rtlcss())                             // Convert to RTL
        .pipe(rename({ basename: 'rtl' }))          // Rename to rtl.css
        .pipe(gulp.dest(''));                       // Output RTL stylesheets (rtl.css)
});

gulp.task('js', function() {
    return gulp.src(['js/*.js'])
        .pipe(jshint())                             // Check those js files for errors
        .pipe(jshint.reporter('default'))
        .pipe(concat('site.js'))                    // Concatenate all js files in the js folder into site.js
        .pipe(rename({suffix: '.min'}))             // Rename it to have ".min" in the name
        .pipe(uglify())                             // Minify that puppy!
        .pipe(gulp.dest('js'))
});

gulp.task('images', function() {
    return gulp.src('images/src/*')               // Take all images from the images/src directory
        .pipe(plumber({errorHandler: onError}))     // If there is an error, run the onError function
        .pipe(imagemin({optimizationLevel: 7, progressive: true}))  // Optimize images, these are the settings
        .pipe(gulp.dest('images/dist'));            // Save optimized images in the images/dist directory
});

var onError = function (err) {
    console.log('An error occurred:', gutil.colors.magenta(err.message));
    gutil.beep();
    this.emit('end');
};

gulp.task('default', ['sass', 'js', 'images', 'watch']);