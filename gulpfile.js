var gulp  = require("gulp"),
uglify    = require('gulp-uglify');
minifyCss = require('gulp-minify-css');
concat    = require('gulp-concat');

gulp.task("js",function(){
  return gulp.src("src/js/ng-ripple.js")
  .pipe(concat('ng-ripple.min.js'))
  .pipe(uglify({
    preserveComments: "some"
  }))
  .pipe(gulp.dest("dist/js"));
});

gulp.task("css",function(){
  return gulp.src("src/css/ng-ripple.css")
  .pipe(concat('ng-ripple.min.css'))
  .pipe(minifyCss())
  .pipe(gulp.dest("dist/css"));
});

gulp.task("default",["js","css"]);