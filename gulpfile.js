// Generated on 2014-10-21 using generator-jhipster 1.4.0
'use strict';

var gulp = require('gulp'),
    prefix = require('gulp-autoprefixer'),
    minifyCss = require('gulp-minify-css'),
    usemin = require('gulp-usemin'),
    uglify = require('gulp-uglify'),
    minifyHtml = require('gulp-minify-html'),
    livereload = require('gulp-livereload'),
    imagemin = require('gulp-imagemin'),
    ngAnnotate = require('gulp-ng-annotate'),
    jshint = require('gulp-jshint'),
    rev = require('gulp-rev'),
    connect = require('gulp-connect'),
    proxy = require('proxy-middleware'),
    es = require('event-stream'),
    flatten = require('gulp-flatten'),
    clean = require('gulp-clean'),
    replace = require('gulp-replace'),
    browserify = require('gulp-browserify');

var karma = require('gulp-karma')({configFile: 'src/test/javascript/karma.conf.js'});

var yeoman = {
    app: 'src/main/webapp/',//require('./bower.json').appPath || 'app',
    dist: 'src/main/webapp/dist/',
    test: 'src/test/javascript/spec/',
    tmp: '.tmp/'
}

gulp.task('clean', function(){
    return gulp.src(yeoman.dist, {read: false}).
        pipe(clean());
});

gulp.task('clean:tmp', function(){
    return gulp.src(yeoman.tmp, {read: false}).
        pipe(clean());
});

gulp.task('test', function(){
    karma.once();
});

gulp.task('copy', ['clean'], function(){
    return es.merge(gulp.src(yeoman.app + 'i18n/**').
              pipe(gulp.dest(yeoman.dist + 'i18n/')),
              gulp.src(yeoman.app + '**/*.{woff,svg,ttf,eot}').
              pipe(flatten()).
              pipe(gulp.dest(yeoman.dist + 'fonts/')));
});

gulp.task('images', function(){
        return gulp.src(yeoman.app + 'images/**').
            pipe(imagemin({optimizationLevel: 5})).
            pipe(gulp.dest(yeoman.dist + 'images'));
});



gulp.task('styles', [], function() {
    return gulp.src(yeoman.app + '{,*/}*.css').
        pipe(gulp.dest(yeoman.tmp));
});

gulp.task('server', ['watch'], function() {
    connect.server(
        {
            root: [yeoman.app, yeoman.tmp],
            port: 9000,
            livereload: true,
            middleware: function(connect, o) {
                return [
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/app');
                        options.route = '/app';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/api-docs');
                        options.route = '/api-docs';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/metrics');
                        options.route = '/metrics';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/dump');
                        options.route = '/dump';
                        return proxy(options);
                    })()
                ];
            }
        }
    );
});

gulp.task('watch', function() {
    gulp.watch(yeoman.app + 'scripts/**', ['browserify']);
    gulp.watch('src/images/**', ['images']);
    livereload();
});

gulp.task('server:dist', ['build'], function() {
    connect.server(
        {
            root: [yeoman.dist],
            port: 9000,
            //livereload: true,
            middleware: function(connect, o) {
                return [
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/app');
                        options.route = '/app';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/metrics');
                        options.route = '/metrics';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/dump');
                        options.route = '/dump';
                        return proxy(options);
                    })(),
                    (function() {
                        var url = require('url');
                        var proxy = require('proxy-middleware');
                        var options = url.parse('http://localhost:8080/api-docs');
                        options.route = '/api-docs';
                        return proxy(options);
                    })()
                ];
            }
        }
    );
});

gulp.task('build', ['clean', 'copy'], function() {
    gulp.run('usemin');
});

gulp.task('usemin', ['images', 'styles'], function(){
    return gulp.src(yeoman.app + '{,views/}*.html').
        pipe(usemin({
            css: [
                prefix.apply(),
                replace(/[0-9a-zA-Z\-_\s\.\/]*\/([a-zA-Z\-_\.0-9]*\.(woff|eot|ttf|svg))/g, '/fonts/$1'),
                //minifyCss(),
                'concat',
                rev()
            ],
            html: [
                minifyHtml({empty: true, conditionals:true})
            ],
            js: [
                ngAnnotate(),
                uglify(),
                'concat',
                rev()
            ]
        })).
        pipe(gulp.dest(yeoman.dist));
});

gulp.task('default', function() {
    gulp.run('test');
    gulp.run('build');
});
