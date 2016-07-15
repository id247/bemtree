const gulp = require('gulp');
const concat = require('gulp-concat');
const bemxjst = require('gulp-bem-xjst');
const bemhtml = bemxjst.bemhtml;
const bemtree = bemxjst.bemtree;
const path = require('path');
const thru = require('through2');
const gulpEval = require('gulp-eval');
const rename = require('gulp-rename');
const del = require('del');

gulp.task('bemhtml', function() {
  return gulp.src('./blocks/**/*.bemhtml.js') // Собираем все шаблоны без учета порядка
	.pipe(concat('all.js')) // Склеиваем в один файл
	.pipe(bemhtml()) // Компилируем и добавляем ядро
	.pipe(gulp.dest('temp')); // Сохраняем в temp
});

gulp.task('bemtree', function() {
  return gulp.src('./pages/*.template.js') // Берем все страницы сайта
	.pipe(bemtree()) // Компилируем
	.pipe(rename(function (path) {
		path.basename = path.basename.replace('.template', '');
		return path;
	}))
	.pipe(gulp.dest('temp')); // Сохраняем в temp
});

gulp.task('html', function() {
	const BEMHTML = require('./temp/all.bemhtml.js');
	const data = require('./data/data.js');

  	return gulp.src('./temp/*.bemtree.js') // Собираем все bemtree файлы страниц
  	.pipe(gulpEval())
  	.pipe(thru.obj(function(file, enc, cb) {
	 	// Применяем шаблоны и переименовываем в html
	 	const BEMTREE = file.data;
		try {
			const html = BEMHTML.apply(BEMTREE.apply({block: 'root', data: data}));
	  		console.log(html);
	  		file.contents = new Buffer(html);
		} catch (e) {
			// Сохраняем ошибку, чтобы проще было отлаживать
			console.error(e);
			file.contents = new Buffer(String(e.stack));
		}
		file.path = path.join(path.dirname(file.path), path.basename(file.path).split('.')[0] + '.html');
	  	
	  	cb(null, file);
	}))
	.pipe(rename({dirname: ''}))
	.pipe(gulp.dest('dist')); // Сохраняем в dist
});


gulp.task('test', function(callback) {
	const BEMHTML = require('./temp/all.bemhtml.js');
	const BEMTREE = require('./temp/all.bemtree.js');
	const data = require('./data/data.js');
  	
  	console.log(BEMHTML.apply(BEMTREE.apply({block: 'root', data: data})));
  	callback();
});

gulp.task('clean', function() {
	return del(['temp', 'dist']);
});

gulp.task('default', gulp.series('clean', 'bemhtml', 'bemtree', 'html'));