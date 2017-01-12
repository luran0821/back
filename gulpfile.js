var gulp = require('gulp'),
    jade = require('gulp-jade'),
    babel = require("gulp-babel"),
    livereload = require('gulp-livereload');
gulp.task('ts_jade', function() {
    gulp.src('./build/jade/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('./'))
});
gulp.task('ds_jade', function() {
    gulp.src('./build/jade/template/*.jade')
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest('./html/'))
});
gulp.task('live', function () {
    livereload.listen();
    gulp.watch('js/webpack/*.js',function(file){
        livereload.changed(file.path);
    });
    gulp.watch('html/*.html', function (file) {
        livereload.changed(file.path);
    });
});

// livereload
gulp.task('livereload', function(file) {
    livereload.changed(file.path);
});

gulp.task('default', function() {
    gulp.start('ts_jade','ds_jade','live','watch');
});

gulp.task('watch', function() {
    gulp.watch('build/jade/template/*.jade', ['ds_jade']);
    gulp.watch('build/jade/*.jade', ['ts_jade']);
    gulp.watch('js/webpack/*.js', ['livereload']);
    gulp.watch('html/*.html', ['livereload']);
});

// gulp.task('live', function () {
//     // var server = livereload();
//     // gulp.watch('../Lomo-admin/**/*.html', function (file) {
//     //     server.changed(file.path);
//     // });
//     // gulp.watch('js/webpack/*.js', function (file) {
//     //     server.changed(file.path);
//     //
//     // });
//     livereload.listen();
//     gulp.watch('js/webpack/*.js',function(file){
//         livereload.changed(file.path);
//     });
// });
