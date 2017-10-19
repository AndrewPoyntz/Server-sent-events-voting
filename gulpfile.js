const gulp = require('gulp');

gulp.task('copyLibs', ()=>{
	let sourceFiles = [
		'node_modules/chart.js/dist/Chart.js',
		'node_modules/jquery/dist/jquery.js',
		'node_modules/font-awesome/css/**.*',
	];
	gulp.src(sourceFiles)
		.pipe(gulp.dest('frontend/lib'));
	return gulp.src(['node_modules/font-awesome/fonts/**.*'])
		.pipe(gulp.dest('frontend/fonts'))
});

gulp.task('default');