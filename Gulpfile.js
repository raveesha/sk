'use strict';

var os = require('os');
var gulp = require('gulp');
var open = require('gulp-open');
var copy = require('gulp-copy');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var clean = require('gulp-rimraf');

gulp.task('clean', function () {
  return gulp.src(['!.gitignore','!.git/**/*','dist/*'])
    .pipe(clean());
});

gulp.task('build', ['clean'],function () {
  return gulp.src(['!node_modules/**/*','!dist/**/*','**/*'])
    .pipe(copy("dist"));
})

gulp.task('lint', function () {
  gulp.src(['api/**/*','config/**/*','route.js','app.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
})

gulp.task('run', function () {
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  nodemon({ script: 'server/app.js'
    , ext: 'html js'
    , env: require('./server/config/local.env')
    , ignore: [] //'ignored.js'
    , tasks: [] })
    .on('restart', function () {
      console.log('restarted!')
    })
})

// Run App
gulp.task('open', function(){
  gulp.src('./index.html')
    .pipe(open());
});

gulp.task('test', function () {
  process.env.NODE_ENV = 'test'
  return gulp.src('./server/api/**/*.spec.js', {read: false})
    .pipe(mocha({timeout:15000}));
});

