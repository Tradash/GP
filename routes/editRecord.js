var express = require('express');
var router = express.Router();
const multer = require('multer');


// === begin my kod
const assert = require('assert');
const doItDB = require('../dbprovider.js').doItDB;
const read_pict = require('../dbprovider.js').read_pict;
const collName = require('../dbprovider.js').collName;
const collTmp = require('../dbprovider.js').collTmp;
const loadFR = require('../dbprovider.js').loadFR;
const mongodb = require('mongodb');

const show_max = 3;

const storage = multer.memoryStorage();
const upload = multer({storage});
let myquery;

//upload.single('image'),
router.post('/:idd', upload.single('img'), function(req, res, next) {
	doItDB((err, db, cli)=>{
		if (err) { return next(err); }
		const id = req.params.idd;
		if (!req.body.name) {
			// Сохранение изображения во временной базе
			loadFR([req.file.buffer]).then(elem =>  {
				const buff = read_pict(elem[0]);
				db.collection(collTmp).insertOne({idold: id, img: buff }, (err, rez) => {
					if (err) {
						const error = new Error('Ошибка при сохранении изображения во временной БД');
						error.httpStatusCode = 400;
						return nexr(error);}
				});
				myquery = {_id : new mongodb.ObjectID(id)};
				// Создание формы для ввода оставшихся полей
				db.collection(collName).findOne(myquery, function(err, doc){
					if (err) {
						const error = new Error('Ошибка при загрузке изображения из временной БД');
						error.httpStatusCode = 400;
						return nexr(error);}
						else {
//							console.log(cursor.length, doc._id);
							doc.img = buff;
							res.render('editRecord', { 
								title: 'Редактирование записи (изображение загружено)', 
								cursor: doc, 
								imgfile: 'new' });
							cli.close();
					}
				});
			});
		} else {
			doItDB((err, db, cli)=>{
				if (err) { return next(err); }
				myquery = {idold: id};
				// Забираем изображение из временного хранилища
				db.collection(collTmp).findOne(myquery, function(err, doc){
					if (err) {
						const error = new Error('Ошибка при загрузке изображения из временной БД');
						error.httpStatusCode = 400;
						return nexr(error);}
					else {
						let myquery = {_id : new mongodb.ObjectID(id)};
						const newRec = { $set: {
							name: req.body.name,	
							name_lat: req.body.name_lat, 
							url: req.body.url,
							img: doc.img
						}};
						// Обновляем запись в БД
						db.collection(collName).findOneAndUpdate(myquery,	newRec,
							function(err, r) {
								if (err) {
									const error = new Error('Ошибка при обновлении записи');
									error.httpStatusCode = 400;
									return nexr(error);}
									else {
										// Удаляем изображение из временного хранилища
										myquery = {idold: id};
										db.collection(collTmp).deleteMany(myquery, function(err, r) {
											if (err) {
												const error = new Error('Ошибка при удалении изображения из временной БД');
												error.httpStatusCode = 400;
												return nexr(error);}
											else { 
												cli.close;
												res.redirect('/');
											};										
										});
									}
							});
						};				
				});
			});
		}
	});
});

router.get('/:id', function(req, res, next) {
	doItDB((err, db, cli)=>{
		if (err) { return next(err); }
		const id = req.params.id;
		let myquery = {_id : new mongodb.ObjectID(id)};
		db.collection(collName).find(myquery).toArray(function(err, cursor){
			if (err) {
				const error = new Error('Редактируемая запись отсутсвует в БД');
				error.httpStatusCode = 400;
				return nexr(error); 
			}
			else if (cursor.length) {
				console.log(cursor.length, cursor[0]._id);
				res.render('editRecord', { title: 'Редактирование записи', cursor: cursor[0], imgfile: 'old' });
			}
					else {
						console.log('No document in DB')
					  res.render('index', { title: 'Тестовое приложения, Запись не найдена', cursor : null });
					}
			cli.close;
		});		
	});
});

module.exports = router;
