var gulp = require('gulp');
var sass = require('gulp-sass');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var zip = require('gulp-zip');
var del = require('del');

var paths = {
    sass: 'client/sass/**/*.scss',
    scripts: ['client/js/**/*.js', '!client/external/**/*.js'],
    jslib: ['client/jslib/jquery.swiper.js','client/jslib/jquery.backtop.js'],
    images: 'client/img/**/*'
};

var timestamp = function() {
    var curDate = new Date();

    var Year = curDate.getFullYear().toString().slice(-2);
    var Month = ('0' + (curDate.getMonth() + 1)).slice(-2);
    var Day = ('0' + curDate.getDate()).slice(-2);
    var Hours = ("0" + curDate.getHours()).slice(-2);
    var Minutes = ("0" + curDate.getMinutes()).slice(-2);

    return FullDate = Year + Month + Day + Hours + Minutes;
};

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build/js','build/css'], cb);
});

var css = function() {
    return gulp.src(paths.sass)
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build/css'));
};
gulp.task('css', ['clean'], css);
gulp.task('css-watch', css);

var scripts = function() {
    return gulp.src(paths.scripts)
        //.pipe(sourcemaps.init())
        //.pipe(coffee())
        .pipe(uglify())
        //.pipe(concat('app201604.min.js'))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
};
gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);

var jslibrary = function() {
    return gulp.src(paths.jslib)
        .pipe(uglify())
        .pipe(concat('lib201604.min.js'))
        .pipe(gulp.dest('build/js'));
};
gulp.task('jslibrary', ['clean'], jslibrary);
gulp.task('jslibrary-watch', jslibrary);

// Rerun the task when a file changes
gulp.task('watch', function() {
    gulp.watch(paths.sass, ['css-watch']);
    gulp.watch(paths.scripts, ['scripts-watch']);
    gulp.watch(paths.jslib, ['jslibrary-watch']);
});

gulp.task('zip', function(){
    return gulp.src('build/**')
        .pipe(zip('ah2_'+ timestamp() +'.zip'))
        .pipe(gulp.dest('zip'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'css', 'scripts', 'jslibrary']);