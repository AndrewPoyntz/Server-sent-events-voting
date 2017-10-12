const gulp = require('gulp');

gulp.task('copyLibs', ()=>{
	let sourceFiles = [
		'node_modules/chart.js/dist/Chart.js',
		'node_modules/jquery/dist/jquery.js'
	];
	return gulp.src(sourceFiles)
		.pipe(gulp.dest('lib'));
});

gulp.task('default')