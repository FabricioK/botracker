// gulp
var gulp = require('gulp'),
    del = require('del'),
    inject = require('gulp-inject');


var allBowerRequiredFirstComponentsAngular = ['./bower_components/angular/**/*.min.js'];

var allBowerRequiredFirstComponentsJquery = [
    './bower_components/jquery/**/*.min.js'
    , '!./bower_components/jquery/**/*.slim.min.js'
];
var allBowerAuxComponents = [
    './bower_components/**/*.min.js'
    , './bower_components/**/*.min.js'
     , './bower_components/leaflet/**/*-src.js'
    , '!./bower_components/jquery/**/*.min.js'
    , '!./bower_components/angular/**/*.min.js'];

var allAppComponents = ['./interface/**/*.js', '!./interface/js/app.js'];

var allCssFiles = [
    './bower_components/**/*.css'
    , './interface/**/*.css'
    , './bower_components/leaflet/**/*.css'
    , '!./bower_components/**/*-theme.css'
    , '!./bower_components/**/*.min.css'
    , '!./bower_components/**/*-csp.css'];
    
var allTemplatesFiles = ['./interface/templates/**/*.html'];

var allFontsFiles = [
                './bower_components/**/*.otf',
                './bower_components/**/*.eot',
                './bower_components/**/*.svg',
                './bower_components/**/*.ttf',
                './bower_components/**/*.woff',
                './bower_components/**/*.woff2'];

function clean() {
    return del('./dist/**/*');
};

function cssmove() {
    return gulp.src(allCssFiles)
        .pipe(gulp.dest('dist/css'));
}
function templatesmove() {
    return gulp.src(allTemplatesFiles)
        .pipe(gulp.dest('dist/templates'));
}

function fontsmove() {
    return gulp.src(allFontsFiles)
        .pipe(gulp.dest('dist/css'));
}

function bowerminJquery() {
    return gulp.src(allBowerRequiredFirstComponentsJquery)
        .pipe(gulp.dest('dist/jquery'));
};
function bowerminAngular() {
    return gulp.src(allBowerRequiredFirstComponentsAngular)
        .pipe(gulp.dest('dist/angular'));
};
function bowerAuxmin() {
    return gulp.src(allBowerAuxComponents)
        .pipe(gulp.dest('dist/boweraux'));
};

function appmin() {
    return gulp.src('./interface/js/app.js')
    // .pipe(uglify())
        .pipe(gulp.dest('dist'));
};
function appcontentmin() {
    return gulp.src(allAppComponents)
    //.pipe(uglify())
        .pipe(gulp.dest('dist/appmin'));
};
//Injects 
function injectBowerJquery() {
    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/jquery/**/*.js'], { read: false })
            , { starttag: '<!-- inject:bowerjquery:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};
function injectBowerAngular() {
    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/angular/**/*.js'], { read: false })
            , { starttag: '<!-- inject:bowerangular:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};
function injectAuxBower() {
    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/boweraux/**/*.js'], { read: false })
            , { starttag: '<!-- inject:boweraux:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};
function injectCss() {
    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/css/**/*.css'], { read: false })
            , { starttag: '<!-- inject:css:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};
function injectApp() {

    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/app.js'], { read: false })
            , { starttag: '<!-- inject:app:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};

function injectAppContent() {
    return gulp.src('./views/index.html')
        .pipe(inject(gulp.src(['./dist/appmin/**/*.js'], { read: false })
            , { starttag: '<!-- inject:appcontent:{{ext}} -->' }))
        .pipe(gulp.dest('./views'));
};

gulp.task('prod'
    , gulp.series(
        clean,
        cssmove,
        templatesmove,
        fontsmove,
        bowerminJquery,
        bowerminAngular,
        bowerAuxmin,
        appmin,
        appcontentmin,
        injectCss,
        injectBowerJquery,
        injectBowerAngular,
        injectAuxBower,
        injectApp,
        injectAppContent
        ));