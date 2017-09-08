//导入插件
var gulp = require('gulp'), //导入插件
	scss = require('gulp-scss'), //导入scss编译
	sass = require('gulp-sass'), //导入scss编译
	cleanCss = require('gulp-clean-css'), //压缩css
	uglify = require('gulp-uglify'), //压缩js
	combiner = require('stream-combiner2'), //监听错误信息
	changed = require('gulp-changed'), //只编译改动过的文件
	rev = require('gulp-rev'), //版本控制
	revCollector = require('gulp-rev-collector'),
	babel = require('gulp-babel'), //用于编译es6
	clean = require('gulp-clean'), //清理
	stripDebug = require('gulp-strip-debug'), //删除console
	imagemin = require('gulp-imagemin'), //图片压缩
	cdn = require('gulp-cdn'), //添加cdn地址
	livereload = require('gulp-livereload'); //浏览器自动刷新页面
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');
var PATH_ENV = process.env.PATH_ENV;
var cdnUrl = '/statics';
var webUrl = '/';
var pcUrl = '/';
var wapUrl = '/';
if(PATH_ENV=='test'){
	cdnUrl = '/';
	webUrl = '/';
	pcUrl = '/';
	wapUrl = '/';
}
if(PATH_ENV=='prod'){
	cdnUrl = '/';
	webUrl = '/';
	pcUrl = '/';
	wapUrl = '/';
}

var devPort = 8888;
var distPort = 9999;

/**
 *  开发环境 task
 */
// webserver 启动本地服务器(开发环境)
gulp.task('devServer', function() {
	browserSync.init({
		port: devPort,
		server: {
			baseDir: ["./src"],
			directory: true
		},
	});
});

//开发环境scss文件解析
gulp.task('css', function() {
	var _DEST = "src/statics/css";
	gulp.src("./src/statics/css/**/*.scss")
		.pipe(sass())
		.pipe(autoprefixer())
		.pipe(cleanCss())
		.pipe(gulp.dest(_DEST)); //css压缩后存放路径
});

//开发环境 js文件用到 es6的文件解析
gulp.task('jsMinES6', function() {
	var _DEST = "src/statics/js/pages";
	gulp.src(["src/statics/js/pages_es6/**/*.js"])
		.pipe(babel({
			"presets": ["es2015", "stage-0"]
		}))
		// .pipe(uglify({
		// 	mangle: {
		// 		except: ['require', 'exports', 'module']
		// 	}
		// }))
		.pipe(gulp.dest(_DEST)); //css压缩后存放路径
});


//动态监听css文件改动
gulp.task("cssWatch", function() {
	gulp.watch("src/statics/css/**/*.scss", ["css"], function() {

	});
});

//动态监听es6文件改动
gulp.task("jsES6Watch", function() {
	gulp.watch(["src/statics/js/pages_es6/**/*.js"], ["jsMinES6"], function() {

	});
});

/**
 * 生产环境 task
 */
// webserver 启动本地服务器（生产环境）
gulp.task('distServer', function() {
	browserSync.init({
		port: distPort,
		server: {
			baseDir: ["./dist"],
			directory: true
		},
	});
});

//清除dist文件
gulp.task('clean', function() {
	return gulp.src('dist')
		.pipe(clean());
});

//css压缩+rev
gulp.task('cssMin', function() {
	console.log(process.env.PATH_ENV);
	var _DEST = "dist/statics/css";
	gulp.src(["src/statics/css/**/*.scss", "!src/statics/css/_ignore/**/*.css"])
		.pipe(sass())
		.pipe(cdn({
			domain: "/statics",
			cdn: cdnUrl
		}))
		.pipe(cleanCss())
		.pipe(rev()) //Hash改名
		.pipe(gulp.dest(_DEST)) //css压缩后存放路径
		.pipe(rev.manifest())
		.pipe(gulp.dest('src/rev/css')); //输出改名前后的对应关系
});

//js 编译+rev
gulp.task('jsMin', function() {
	var _DEST = "dist/statics/js";
	var combined = combiner.obj([
		gulp.src(["src/statics/js/**/*.js", "!src/statics/js/pages_es6/**/*.js", "!src/statics/js/plugins/**/*.js"]),
		babel({
			"presets": ["es2015", "stage-0"]
		}),
		cdn({
			domain: "/statics",
			cdn: cdnUrl
		}),
		cdn({
			domain: "/webUrl",
			cdn: webUrl
		}),
		cdn({
			domain: "/wapUrl",
			cdn: wapUrl
		}),
		cdn({
			domain: "/pcUrl",
			cdn: pcUrl
		}),
		stripDebug(),
		uglify({
			mangle: {
				except: ['require', 'exports', 'module']
			}
		}),
		rev(), //Hash改名
		gulp.dest(_DEST),
		rev.manifest(),
		gulp.dest('src/rev/js'), //输出改名前后的对应关系
	]);
	combined.on('error', console.error.bind(console));
	return combined;
});
//复制commonjs
// gulp.task('commonJs', function() {
// 	var _DEST = "src/statics/js/common";
// 	var combined = combiner.obj([
// 		gulp.src("src/statics/js/commoncdn/**/*.js"),
		
// 		gulp.dest(_DEST)
// 	]);
// 	combined.on('error', console.error.bind(console));
// 	return combined;
// });

//图片压缩
gulp.task('imageMin', function() {
	return gulp.src('src/statics/img/**/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/statics/img'));
});

//复制插件
gulp.task('copyPlugins', function() {
	return gulp.src('src/statics/js/plugins/**/*')
		.pipe(gulp.dest('dist/statics/js/plugins/'));
});
//复制模拟数据
// gulp.task('copyMock', function() {
// 	return gulp.src('src/statics/mock/**/*')
// 		.pipe(gulp.dest('dist/statics/mock/'));
// });

// html 版本缓存管理
gulp.task('dist', ['jsMin', 'cssMin', 'copyPlugins', 'imageMin'], function() {
	//复制icon
	gulp.src('src/view/*.ico')
		.pipe(gulp.dest('dist/view'));
	//复制iconfont
	gulp.src('src/statics/iconfont/*')
		.pipe(gulp.dest('dist/statics/iconfont'));

	var src = [
		'src/rev/**/*.json', //上述输出的改名前后的对应关系
		'src/**/*.html'
	]
	return gulp.src(src)
		.pipe(revCollector()) //根据对应关系进行替换
		.pipe(cdn({
			domain: "/statics",
			cdn: cdnUrl
		}))
		.pipe(gulp.dest('dist')); //输出替换后的问题
});

//任务
gulp.task("default", function() {
	console.log("请输入具体任务名称");
	console.log("css压缩：gulp cssMin");
	console.log("js压缩：gulp jsMin");
	console.log("图片压缩：gulp imageMin");
	console.log("复制插件：gulp copyPlugins");
	console.log("复制模拟数据：gulp copyMock");
	console.log("css监听并压缩：gulp cssWatch");
	console.log("版本缓存管理：gulp dist");
	console.log("启动服务：npm start");
	console.log("压缩创建本地dist：npm run build");
	console.log("压缩创建测试dist:test：npm run build:test");
	console.log("压缩创建生产dist:prod：npm run build:prod");
});