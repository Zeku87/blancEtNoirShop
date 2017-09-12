var gulp = require('gulp');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var autoprefixer = require('autoprefixer');
var csswring = require('csswring');
var cssimport = require('postcss-import');

gulp.task('html', ['scss'], function(){

    var injectCssFiles = gulp.src('./dist/css/*.css');

    var injectCssOptions = {
	addRootSlash : false,
	ignorePath : ['dist'],
	starttag : '<!-- inject:css -->',
	endtag : '<!-- endinject -->'
    };
    
    return gulp.src('./src/index.html')
	.pipe(inject(injectCssFiles, injectCssOptions))
	.pipe(gulp.dest('./dist'));
});

gulp.task('scss', function(){
    var injectScssFiles = gulp.src(['./src/scss/global/*.scss','./src/scss/modules/*.scss']);

    function transformFilePath(filePath){
	return '@import "' + filePath + '";';
    }

    var injectScssOptions = {
	addRootSlash : false,
	starttag : '// inject:scss',
	endtag : '// end_inject',
	transform : transformFilePath
    };

    var processors = [csswring, autoprefixer, cssimport];
    
    return gulp.src('./src/scss/main.scss')
	.pipe(inject(injectScssFiles, injectScssOptions))
	.pipe(sass())
	.pipe(postcss(processors))
	.pipe(gulp.dest('./dist/css'));
    
});

gulp.task('watch', function(){
    
    /*watch('./src/index.html', function(){
	gulp.start('html');
    });*/

    watch(['./src/index.html', './src/scss/global/*.scss', './src/scss/modules/*.scss', './src/scss/main.scss'], function(){
	gulp.start('html');
    });

    
});
