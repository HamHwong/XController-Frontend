var gulp = require('gulp')
var less = require('gulp-less')
var webserver = require('gulp-webserver')
var open = require('gulp-open')
var connect = require('gulp-connect')
var livereload = require('gulp-livereload')
var clean = require('gulp-clean');
var rev = require('gulp-rev')
var revCollector = require('gulp-rev-collector')
var pug = require('gulp-pug')
var concat = require('gulp-concat')
var cssmin = require('gulp-minify-css')

var config = require('./config/ServerConfig.js')
var __dist = config.path.dist
var __src = config.path.src
var __host = config.server.host
var __port = config.server.port
var __homepage = config.server.homepage || "index.html"

gulp.task('webserver', function() {
  connect.server({
    host: __host,
    port: __port,
    root: config.server.root,
    liveload: true,
  })
});

gulp.task('less', function() {
  return gulp.src(__src + '/less/*.less')
    .pipe(less())
    .pipe(gulp.dest(__src + '/css/'))
})

//Html替换css、js文件版本
gulp.task('revHtml', ['revCss', 'revJs'], function() {
  return gulp.src([config.path.config + '/*.json', 'src/**/*.html'])
    .pipe(revCollector())
    .pipe(gulp.dest('dist'));
});

var jsSrc = config.path.js
var cssSrc = config.path.css

gulp.task('revJs', ['clean-js'], function() {
  return gulp.src([jsSrc + "/**/*.js"])
    .pipe(rev())
    .pipe(gulp.dest(__dist + "/js"))
    .pipe(rev.manifest({
      path: 'rev-js-manifest.json'
    }))
    .pipe(gulp.dest('config'));
});
gulp.task('revCss', ['clean-css', 'less'], function() {
  return gulp.src([cssSrc + "/**/*.css"])
    .pipe(rev())
    .pipe(gulp.dest(__dist + "/css"))
    .pipe(rev.manifest({
      path: 'rev-css-manifest.json'
    }))
    .pipe(gulp.dest('config'));
});
gulp.task('clean-css', function(event) {
  return gulp.src(['dist/css/**/*.css'])
    .pipe(clean({
      force: true
    }));
})
gulp.task('clean-js', function(event) {
  return gulp.src(['dist/js/**/*.js'])
    .pipe(clean({
      force: true
    }));
})

gulp.task('watch', function() {
  // gulp.watch([__src + '/less/**/*.less',
  //   __src + '/css/**/*.css',
  //   __src + '/js/**/*.js',
  //   __src + '/pug/**/*.pug',
  //   __src + '/**/*.html',
  //   './config/*Config.*',
  // ], ['revHtml'])
  // gulp.watch([__src + '/css/**/*.css','./config/*Config.css'], ['revCss'])
  gulp.watch([__src + '/less/**/*.less', './config/*Config.less'], ['revHtml'])
  gulp.watch([__src + '/js/**/*.js', './config/*Config.js'], ['revHtml'])
  gulp.watch([__src + '/pug/**/*.pug',
    __src + '/**/*.html',
    './config/*Config.*',
  ], ['revHtml'])
})

gulp.task('open', function() {
  var options = {
    uri: __host + ":" + __port + "/" + __homepage,
    app: 'chrome'
  }
  return gulp.src("").pipe(open(options))
})

gulp.task('pug', function() {
  return gulp.src(__src + '/pug/**/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
})

gulp.task('concat-css', function() {
  return gulp.src(['src/css/**/*.css', '!src/css/bootstrap*.css'])
    .pipe(concat('style.css'))
    .pipe(cssmin({
      advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
      keepSpecialComments: '*'
      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }))
    .pipe(gulp.dest('dist/test'))
})

gulp.task('default', ['watch', 'revHtml', 'webserver'], function() {
  gulp.start('open') //被弃用，仍能用，4.0官方将提供同步任务
})
