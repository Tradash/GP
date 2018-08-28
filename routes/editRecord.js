var express = require('express');
var router = express.Router();
const multer = require('multer');


// === begin my kod
const assert = require('assert');
const doItDB = require('../dbprovider.js').doItDB;
const read_pict = require('../dbprovider.js').read_pict;
const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
const show_max = 3;

const storage = multer.memoryStorage();
const upload = multer({storage});

//upload.single('image'),
router.post('/:idd', upload.single('img'), function(req, res, next) {
//console.log('zzz',req.body.name);
	const id = req.params.idd;
	if (!req.body.name) {
	// Пошла загрузка картинки
		const buff = read_pict(req.file.buffer);
		MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
			assert.equal(null, err);
			console.log('post Connected successfully to DB');
			const db = client.db(dbName);
			db.collection('temp_pict').insertOne({idold: id, img: buff })
			client.close;
			let myquery = {_id : new mongodb.ObjectID(id)};
			db.collection(collName).find(myquery).toArray(function(err, cursor){
				if (err) { throw err; }
					else if (cursor.length) {
						console.log(cursor.length, cursor[0]._id);
						cursor[0].img = buff;
						res.render('editRecord', { title: 'Редактирование записи (изображение загружено)', cursor: cursor[0], imgfile: 'new' });
						client.close();
					}
			});
		});
	} else { // Окончательное сохранение
	res.redirect('/');
	};
//console.log('******',req.file);
//res.redirect('/');
});

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('get Connected successfully to DB');
		const db = client.db(dbName);
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
			client.close;
		});		
	}); 
});

module.exports = router;
