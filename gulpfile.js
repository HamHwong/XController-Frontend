var gulp = require('gulp')
var less = require('gulp-less')
var autoprefixer = require('gulp-autoprefixer')
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
var ejs = require('gulp-ejs')

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

gulp.task('less',['clean-css'], function() {
  return gulp.src([__src + '/less/*.less', './src/templates/**/*.less'])
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 20 versions']
    }))
    .pipe(gulp.dest(__src + '/css/'))
})

//Html替换css、js文件版本
gulp.task('revHtml', ['ejs','revCss', 'revJs'], function() {
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
gulp.task('revCss', ['concat-conponent-css'], function() {
  gulp.src([cssSrc + "/**/*.css", '!src/templates/components/**/*.css'])
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

gulp.task('ejs', function() {
  gulp.src([__src +"/templates/**/*.ejs", "!/src/templates/components/*.ejs"])
    .pipe(ejs({}, {}, {
      ext: ".html"
    }))
    .pipe(gulp.dest("./src/"))
});

gulp.task('watch', function() {
  gulp.watch([
    __src + '/less/**/*.less',
    __src + '/templates/**/*.less',
    __src + '/js/**/*.js',
    './config/*Config.*',
    __src + '/templates/**/*.ejs'
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
    .pipe(gulp.dest('dist/css'))
})
gulp.task('concat-conponent-css',['less'], function() {
  return gulp.src(['./src/css/components/**/*.css'])
    .pipe(concat('components.css'))
    .pipe(cssmin({
      advanced: true, //类型：Boolean 默认：true [是否开启高级优化（合并选择器等）]
      compatibility: 'ie7', //保留ie7及以下兼容写法 类型：String 默认：''or'*' [启用兼容模式； 'ie7'：IE7兼容模式，'ie8'：IE8兼容模式，'*'：IE9+兼容模式]
      keepBreaks: true, //类型：Boolean 默认：false [是否保留换行]
      keepSpecialComments: '*'
      //保留所有特殊前缀 当你用autoprefixer生成的浏览器前缀，如果不加这个参数，有可能将会删除你的部分前缀
    }))
    .pipe(gulp.dest('src/css'))
})

gulp.task('default', [ 'revHtml', 'webserver'], function() {
  gulp.start('watch') //被弃用，仍能用，4.0官方将提供同步任务
  gulp.start('open') //被弃用，仍能用，4.0官方将提供同步任务
})
