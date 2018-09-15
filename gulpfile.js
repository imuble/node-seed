const gulp = require('gulp');
const del = require('del');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('build', function() {
    gulp.src(['./src/**/*.js', './src/**/*.sql', './src/**/*.json']).pipe(
        gulp.dest('dist')
    );
    return tsProject
        .src()
        .pipe(tsProject())
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del(['dist/**/*']);
});

gulp.task('default', gulp.series('build'));
