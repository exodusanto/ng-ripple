var gulp  = require("gulp"),
uglify    = require('gulp-uglify');
minifyCss = require('gulp-minify-css');
concat    = require('gulp-concat');

gulp.task("js-alone",function(){
  return gulp.src("src/js/ng-ripple.js")
  .pipe(concat('ng-ripple.js'))
  .pipe(gulp.dest("dist/js"));
});

gulp.task("js-jquery",function(){
  return gulp.src("src/js/ng-ripple.jquery.js")
  .pipe(concat('ng-ripple.jquery.js'))
  .pipe(gulp.dest("dist/js"));
});

gulp.task("js",["js-alone","js-jquery"]);

gulp.task("css",function(){
  return gulp.src("src/css/ng-ripple.css")
  .pipe(concat('ng-ripple.css'))
  .pipe(gulp.dest("dist/css"));
});

gulp.task("js-alone:min",function(){
  return gulp.src("src/js/ng-ripple.js")
  .pipe(concat('ng-ripple.min.js'))
  .pipe(uglify({
    preserveComments: "some"
  }))
  .pipe(gulp.dest("dist/js"));
});

gulp.task("js-jquery:min",function(){
  return gulp.src("src/js/ng-ripple.jquery.js")
  .pipe(concat('ng-ripple.jquery.min.js'))
  .pipe(uglify({
    preserveComments: "some"
  }))
  .pipe(gulp.dest("dist/js"));
});


gulp.task("js:min",["js-alone:min","js-jquery:min"]);

gulp.task("css:min",function(){
  return gulp.src("src/css/ng-ripple.css")
  .pipe(concat('ng-ripple.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest("dist/css"));
});

gulp.task("default",["js","js:min","css","css:min"]);