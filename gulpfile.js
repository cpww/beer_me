var gulp = require('gulp'),
plugins  = require('gulp-load-plugins')();

// start server via express
gulp.task('server', function() {
  var app = require('./app/app');
  app;
});

// optimize images
gulp.task('images', function() {
  return gulp.src('./public/images/*')
    .pipe(plugins.plumber())
    .pipe(plugins.cache(plugins.imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
    })))
    .pipe(gulp.dest('./assets/images'))
});

// concatenate and uglify scripts
gulp.task('scripts', function() {
  return gulp.src('./public/scripts/author/*.js')
    .pipe(plugins.plumber())
    .pipe(plugins.concat('all.js'))
    .pipe(plugins.uglify())
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/scripts'))
});

// compile and minitfy sass
gulp.task('styles', function() {
  return gulp.src('./public/styles/site.scss')
    .pipe(plugins.plumber())
    .pipe(plugins.rubySass({
      require: ['susy', 'breakpoint'],
      style: 'compressed'
    }))
    .pipe(plugins.rename({suffix: '.min'}))
    .pipe(gulp.dest('./public/styles'))
});

gulp.task('watch', function(){
  gulp.watch('./public/styles/*.scss', ['styles']);
  gulp.watch('./public/scripts/author/**/*.js', ['scripts']);
});

// default task: handle assets, start server, watch & reload
gulp.task('default', ['images', 'scripts', 'styles', 'server', 'watch']);
