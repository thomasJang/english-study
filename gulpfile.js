'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var changed = require('gulp-changed');
var plumber = require('gulp-plumber');
var notify = require("gulp-notify");

var PATHS = {
    src: {
        static: "assets",
        css_src: "assets/css",
        css_dest: "assets/css"
    }
};

function errorAlert(error) {
    notify.onError({title: "Gulp Error", message: "Check your terminal", sound: "Purr"})(error); //Error Notification
    console.log(error.toString());//Prints Error to Console
    this.emit("end"); //End function
}

/**
 * SASS
 */
gulp.task('docs-scss', function () {
    gulp.src(PATHS["src"].css_src + '/docs.scss')
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(gulp.dest(PATHS["src"].css_dest));
});

/**
 * JS
 */
gulp.task('plugins-js', function () {
    gulp.src([
            PATHS["src"].static + '/lib/jquery/dist/jquery.min.js',
            PATHS["src"].static + '/lib/ax5core/dist/ax5core.js',
            PATHS["src"].static + '/lib/ax5ui-calendar/dist/ax5calendar.js',
            PATHS["src"].static + '/lib/ax5ui-dialog/dist/ax5dialog.js',
            PATHS["src"].static + '/lib/ax5ui-formatter/dist/ax5formatter.js',
            PATHS["src"].static + '/lib/ax5ui-mask/dist/ax5mask.js',
            PATHS["src"].static + '/lib/ax5ui-modal/dist/ax5modal.js',
            PATHS["src"].static + '/lib/ax5ui-picker/dist/ax5picker.js',
            PATHS["src"].static + '/lib/ax5ui-toast/dist/ax5toast.js'
        ])
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('plugins.js'))
        //.pipe(babel({presets: ['es2015']}))
        .pipe(uglify())
        .pipe(gulp.dest(PATHS["src"].static + '/js'));
});


/**
 * CSS
 */
gulp.task('plugins-css', function () {
    gulp.src([
            PATHS["src"].static + '/lib/ax5ui-calendar/dist/ax5calendar.css',
            PATHS["src"].static + '/lib/ax5ui-dialog/dist/ax5dialog.css',
            PATHS["src"].static + '/lib/ax5ui-formatter/dist/ax5formatter.css',
            PATHS["src"].static + '/lib/ax5ui-mask/dist/ax5mask.css',
            PATHS["src"].static + '/lib/ax5ui-modal/dist/ax5modal.css',
            PATHS["src"].static + '/lib/ax5ui-picker/dist/ax5picker.css',
            PATHS["src"].static + '/lib/ax5ui-toast/dist/ax5toast.css'
        ])
        .pipe(plumber({errorHandler: errorAlert}))
        .pipe(concat('plugins.css'))
        .pipe(gulp.dest(PATHS["src"].static + '/css'));
});


/**
 * watch
 */
gulp.task('default', function () {

    // SASS
    gulp.watch(PATHS.ax5docs.css_src + '/**/*.scss', ['docs-scss']);
});