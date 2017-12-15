var gulp = require('gulp');
var sass = require('gulp-sass');
var neat = require('node-neat').includePaths; //flexible grid mixins for sass
var postcss = require('gulp-postcss');
var watch = require('gulp-watch');
var inject = require('gulp-inject');
var autoprefixer = require('autoprefixer');
//var csswring = require('csswring');
var cssimport = require('postcss-import'); //to import normalize once sass is compiled

gulp.task('html', ['scss', 'js'], function(){

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
    var sassMain = './src/scss/main.scss';
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

    var processors = [autoprefixer, cssimport];

    
    return gulp.src('./src/scss/main.scss')
	.pipe(inject(injectScssFiles, injectScssOptions))
	.pipe(sass({includePaths: ['./src/scss/main.scss'].concat(neat)}))
	.pipe(postcss(processors))
	.pipe(gulp.dest('./dist/css'));    
});

gulp.task('js', () => {
	return gulp.src('./src/js/app.js').pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function(){

    watch(['./src/index.html', './src/scss/global/*.scss', './src/scss/modules/*.scss', './src/scss/main.scss', './src/js/**.js'], function(){
	gulp.start('html');
    });

    
});
