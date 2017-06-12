var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var zip = require('gulp-zip');
var del = require('del');

var paths = {
    html: '*.html',
    sass: 'client/sass/**/*.scss',
    scripts: ['client/js/**/*.js', '!client/external/**/*.js'],
    jslib: ['client/jslib/**/*.js'],
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

var pkg = require('./package.json');
var banner = ['/**',
    ' * @Author - <%= pkg.author %>',
    ' * @version - ' + timestamp(),
    ' */',
    ''].join('\n');

// Not all tasks need to use streams
// A gulpfile is just another node program and you can use any package available on npm
gulp.task('clean', function(cb) {
    // You can use multiple globbing patterns as you would with `gulp.src`
    del(['build/js','build/css'], cb);
});

var html = function() {
    return gulp.src(paths.html)
        .pipe(connect.reload());
};
gulp.task('html-watch', html);

var css = function() {
    return gulp.src(paths.sass)
        //.pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}))
        //.pipe(sourcemaps.write())
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('build/css'))
        .pipe(connect.reload());
};
gulp.task('css', ['clean'], css);
gulp.task('css-watch', css);

var scripts = function() {
    return gulp.src(paths.scripts)
        //.pipe(sourcemaps.init())
        //.pipe(coffee())
        .pipe(uglify())
        .pipe(concat('app.min.js'))
        //.pipe(sourcemaps.write())
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
};
gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);

var jslibrary = function() {
    return gulp.src(paths.jslib)
        .pipe(uglify())
        .pipe(concat('lib.min.js'))
        .pipe(header(banner, { pkg : pkg }))
        .pipe(gulp.dest('build/js'))
        .pipe(connect.reload());
};
gulp.task('jslibrary', ['clean'], jslibrary);
gulp.task('jslibrary-watch', jslibrary);

// Rerun the task when a file changes
gulp.task('connect', function () {
    connect.server({
        port: 8090,
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch(paths.html, ['html-watch']);
    gulp.watch(paths.sass, ['css-watch']);
    gulp.watch(paths.scripts, ['scripts-watch']);
    gulp.watch(paths.jslib, ['jslibrary-watch']);
});

gulp.task('zip', function(){
    return gulp.src('build/**')
        .pipe(zip('app_'+ timestamp() +'.zip'))
        .pipe(gulp.dest('zip'));
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['connect','watch', 'css', 'scripts', 'jslibrary']);