var express = require('express');
var router = express.Router();
const multer = require('multer');


// === begin my kod
const assert = require('assert');
const doItDB = require('../dbprovider.js').doItDB;
const read_pict = require('../dbprovider.js').read_pict;
const collName = require('../dbprovider.js').collName;
const collTmp = require('../dbprovider.js').collTmp;
const mongodb = require('mongodb');
//const MongoClient = require('mongodb').MongoClient;
//const url = 'mongodb://localhost:27017';
//const dbName = 'Test';
const show_max = 3;

const storage = multer.memoryStorage();
const upload = multer({storage});
let myquery;

//upload.single('image'),
router.post('/:idd', upload.single('img'), function(req, res, next) {
	doItDB((db, cli)=>{
		const id = req.params.idd;
		if (!req.body.name) {
			// Сохранение изображения во временной базе
			const buff = read_pict(req.file.buffer); 
			db.collection(collTmp).insertOne({idold: id, img: buff });
			myquery = {_id : new mongodb.ObjectID(id)};
			// Создание формы для ввода оставшихся полей
			db.collection(collName).findOne(myquery, function(err, doc){
				if (err) { throw err; }
					else {
//						console.log(cursor.length, doc._id);
						doc.img = buff;
						res.render('editRecord', { 
							title: 'Редактирование записи (изображение загружено)', 
							cursor: doc, 
							imgfile: 'new' });
						cli.close();
					}
			});
		} else {
			doItDB((db, cli)=>{
				myquery = {idold: id};
				// Забираем изображение из временного хранилища
				db.collection(collTmp).findOne(myquery, function(err, doc){
					if (err) { throw err; }
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
								if (err) { throw err; }
									else {
										// Удаляем изображение из временного хранилища
										myquery = {idold: id};
										db.collection(collTmp).deleteMany(myquery, function(err, r) {
											if (err) { throw err; }
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
	doItDB((db, cli)=>{
		const id = req.params.id;
		let myquery = {_id : new mongodb.ObjectID(id)};
		db.collection(collName).find(myquery).toArray(function(err, cursor){
			if (err) { throw err; }
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
