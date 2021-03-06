'use strict';

var gulp = require('gulp'),
    fs = require('fs'),
    inject = require('gulp-inject'),
    shell = require('gulp-shell'),
    tslint = require('gulp-tslint'),
    del = require('del'),
    mocha = require('gulp-mocha'),
    Config = require('./gulpfile.config');

var config = new Config();

/**
 * Update our general tsd.d.ts with references to all TypeScript files
 */
gulp.task('generate-ts-refs', function () {
    // Check if tsd.d.ts exists
    fs.stat(config.appTypeScriptReferences, function(err, stat) {
        if(err) {
            // Create tsd.d.ts file
            var stream = fs.createWriteStream(config.appTypeScriptReferences);
            stream.once('open', function(fd) {
                stream.write("//{\n");
                stream.write("//}");
                stream.end();
                addReferences();
            });
        } else {
            addReferences();
        }
    });
    
    function addReferences(){
        var target = gulp.src(config.appTypeScriptReferences);
        var sources = gulp.src([config.allTypeScript, '!./typings/tsd.d.ts'], {read: false});
        return target.pipe(inject(sources, {
            starttag: '//{',
            endtag: '//}',
            transform: function (filepath) {
                return '/// <reference path="..' + filepath + '" />';
            }
         })).pipe(gulp.dest(config.typings));
    }
});

/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp
        .src(config.appTypeScript)
        .pipe(tslint())
        .pipe(tslint.report('verbose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', ['ts-lint'], shell.task('tsc', {
    "quiet": true,
    "ignoreErrors": true
}));

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean', function (cb) {
  var typeScriptGenFiles = [config.output];

  // delete the files
  del(typeScriptGenFiles, cb);
});

/**
 * Run mocha unit tests
 */
 gulp.task('mocha', ['compile-ts'], function() {
    return gulp
        .src(config.tests, {read: false})
        .pipe(mocha());
 });

gulp.task('default', ['mocha', 'generate-ts-refs']);