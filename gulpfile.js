//The first step to using Gulp is to require it in the gulpfile.
//The require statement tells Node to look into the node_modules folder for a package named gulp. 
//Once the package is found, we assign its contents to the variable gulp.

var pathToHost =  'localhost/kiktv';

// ---  Require Gulp Libraries  ------
var fs        = require('fs');
var gulp      = require('gulp');
var sass      = require('gulp-sass');
var notify      = require('gulp-notify');
var plumber     = require('gulp-plumber');
var browserSync   = require('browser-sync').create();
var mainBowerFiles  = require('main-bower-files');
var filter      = require('gulp-filter');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var bower       = require('gulp-bower');
var order       = require('gulp-order');
var minify      = require('gulp-minify');
var clean     = require('gulp-clean-css');
var useref      = require('gulp-useref');
var gulpIf      = require('gulp-if');
var sourcemaps      = require('gulp-sourcemaps');
var autoprefixer    = require('gulp-autoprefixer');
var rename          = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var gulpMinifyCssnames = require('gulp-minify-cssnames');
var gulpSequence = require('gulp-sequence');
var plumberErrorHandler = { errorHandler: notify.onError({
  title: 'Gulp',
  message: 'Error: <%= error.message %>'
})
};

const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

gulp.task('browserSync', function(){
  browserSync.init({
        proxy: pathToHost,
        injectChanges: true,
        // Use a specific port.
        port: 8000,
    });
});

gulp.task('sass', function(){
    gulp.src(['app/scss/styles.scss'])
      .pipe(plumber(plumberErrorHandler))
      .pipe(sourcemaps.init())
      .pipe(sass({
            style: 'compressed'
         }))
      .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
      .pipe(clean())
      .pipe(sourcemaps.write( '/maps' ))
      .pipe(gulp.dest('app/css'))
      .pipe(browserSync.reload({
        stream: true
      }));
});

gulp.task('vendorjs', function(){
    return gulp.src(mainBowerFiles('**/*.js'))
      .pipe(concat('vendor.js'))
      .pipe(uglify())
      .pipe(gulp.dest('app/js'));
});

gulp.task('vendorscss', function(){
    return gulp.src('./bower_components/**/*.scss')
      .pipe(gulp.dest('app/scss/libs'));
});

gulp.task('vendorfonts', function(){
    return gulp.src('./bower_components/**/*.{eot,svg,ttf,woff,woff2}')
      .pipe(rename(function(path){
        path.dirname = '/';
      }))
      .pipe(gulp.dest('app/fonts'))
})

gulp.task('watch', ['browserSync', 'sass'], function(){
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/**/*.html', [browserSync.reload]);
    gulp.watch('app/**/*.php', [browserSync.reload]);
    gulp.watch('app/**/*.js', [browserSync.reload]);
});

gulp.task('default', ['vendorjs', 'vendorscss','vendorfonts', 'sass' ])





// Use this function to build a minified secure version of the site for clients.

gulp.task('buildimg', function(){
  return gulp.src('app/img/**/*.{png,jpg,jpeg,gif}')
    .pipe(gulp.dest('../build/img'));
});

gulp.task('buildfonts', function(){
  return gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
    .pipe(gulp.dest('../build/fonts'));
});

gulp.task('useref', function(){
  return gulp.src('app/*.php')
   .pipe(useref())
   .pipe(gulpIf('*.js', uglify()))
   .pipe(gulpIf('*.css', clean()))
   .pipe(gulp.dest('../build'));
});

gulp.task('buildphp', function(){
  return gulp.src('../build/*.php')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('../build/'));
});

// gulp.task('minify-css-names', function() {
//     return gulp.src(['../build/*.html', '../build/css/*.css', '../build/scripts/*.js'])
//         .pipe(gulpMinifyCssnames())
//         .pipe(gulp.dest('../build'))
// });

gulp.task('build', gulpSequence('useref', 'buildphp', ['buildimg', 'buildfonts']));

