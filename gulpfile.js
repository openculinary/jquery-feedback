var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var source_files = [
  "src/license.txt",
  "src/pre.txt",
  "src/Core.js",
  "src/Page.js",
  "src/Send.js",
  "src/pages/Form.js",
  "src/pages/Review.js",
  "src/pages/Screenshot.js",
  "src/send/xhr.js",
  "src/post.txt",
];


gulp.task('build', function() {
    return gulp.src(source_files)
      .pipe(concat('feedback.js'))
      .pipe(gulp.dest('.'));
});

gulp.task('build:min', function() {
    return gulp.src(source_files)
      .pipe(concat('feedback.min.js'))
      .pipe(uglify())
      .pipe(gulp.dest('.'));
});

