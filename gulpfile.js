'use strict';

// подключаем необходимые плагины
var     gulp         = require('gulp'),
        postcss      = require('gulp-postcss'),
        util         = require('gulp-util'), // различные утилиты
        autoprefixer = require('autoprefixer'), // расстановка вендорных префиксов
        cssnext      = require('cssnext'), // использование возможностей будущего
        browserSync  = require('browser-sync'), // сервер для перезагрузки браузера
        precss       = require('precss'), // замена scss
        lost         = require('lost'), // сетка на calc()
        rename       = require("gulp-rename"), // переименование файлов
        sourcemaps   = require('gulp-sourcemaps'), // карты кода, для отладки
        stylelint    = require('stylelint'), // проверка правильности написания стилей
        rigger       = require('gulp-rigger'), // простое склеивание файлов
        fileinclude  = require('gulp-file-include'), // альтернативное склеивание файлов
        cache        = require('gulp-cached'); // кеширование файлов

// переменная для работы с путями и расширениями
var path = {

    build: {
        html:          './',
        js:            'local/templates/main/',
        css:           'local/templates/main/',
        images:        'local/templates/main/images/',
        fonts:         'local/templates/main/fonts/',
        main:          './'
    },

    src: {
        html:          'src/html/index.html',
        js:            'src/js/script.js',
        styles:        'src/styles/template_styles.scss',
        images:        'src/images/**/*.*',
        fonts:         'src/fonts/**/*.*'
    },

    mask: {
        scss:          'src/styles/**/*.scss',
        html:          'src/html/**/*.html',
        js:            'src/js/**/*.js',
        images:        'src/images/**/*.{jpg,png,gif,svg}',
        fonts:         'src/fonts/**/*.{eot,svg,ttf,woff,woff2}'
    },

    watch: {
        html:  'src/html/**/*.html',
        js:    'src/js/**/*.js',
        styles:'src/styles/**/*.scss',
        images:'src/images/**/*.*',
        fonts: 'src/fonts/**/*.*'
    }

};

// по умолчани
gulp.task('default', ['build', 'server', 'watch']);

// сборка проекта
gulp.task('build', ['html', 'css', 'js', 'images', 'fonts']);

// отдельные задачи
gulp.task('html', function() {
    gulp.src(path.src.html)
        .pipe(fileinclude()).on('error', util.log)
        .pipe(cache('htmling'))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {

    // Stylelint config rules
    var stylelintConfig = {
        "rules": {
            "color-no-invalid-hex": true,
            "font-family-no-duplicate-names": true,
            "function-calc-no-unspaced-operator": true,
            "unit-no-unknown": true,
            "declaration-block-no-duplicate-properties": true,
            "selector-type-no-unknown": true
        }
    };

    var processors = [
            stylelint(stylelintConfig),
            precss,
            lost,
            cssnext,
            autoprefixer
    ];

    return gulp.src(path.src.styles)
        //.pipe(cache('linting'))
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
         .pipe(rename(function (path) {
            if (path.extname = ".scss")
                path.extname = ".css";
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('images', function() {
    gulp.src(path.src.images)
        .pipe(cache('imaging'))
        .pipe(gulp.dest(path.build.images));
});

gulp.task('js', function() {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(cache('jsing'))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
});

gulp.task('server', function() {
    browserSync.init({
        server: path.build.main
    });
});

gulp.task('watch', function() {
    gulp.watch(path.mask.html, ['html']);
    gulp.watch(path.mask.scss, ['css']);
    gulp.watch(path.mask.js, ['js']);
    gulp.watch(path.mask.images, ['images']);
    gulp.watch(path.mask.fonts, ['fonts']);
});

