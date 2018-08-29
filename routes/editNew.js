var express = require('express');
var router = express.Router();
const multer = require('multer');

const assert = require('assert');
const fs = require('fs');
const doItDB = require('../dbprovider.js').doItDB;
const read_pict = require('../dbprovider.js').read_pict;
const collName = require('../dbprovider.js').collName;
const collTmp = require('../dbprovider.js').collTmp;
const mongodb = require('mongodb');
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
			const cursor = {
				_id: id,
				name: 'Введите название',
				name_lat: 'Введите латинское название',
				url: 'Вставте ссылку на википедию',
				img: buff };
			// Создание формы для ввода оставшихся полей
				res.render('editRecord', { 
					title: 'Редактирование новой записи (изображение загружено)', 
					cursor: cursor, 
					imgfile: 'new' });
					cli.close(); 
		} else {
			doItDB((db, cli)=>{
				myquery = {idold: id};
				// Забираем изображение из временного хранилища
				db.collection(collTmp).findOne(myquery, function(err, doc){
					if (err) { throw err; }
					else {
						const newRec = { 
							name: req.body.name,	
							name_lat: req.body.name_lat, 
							url: req.body.url,
							img: doc.img
						};
						// Сохраняем запись в БД
						db.collection(collName).insert(newRec,
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
	const cursor = {
	_id: id = req.params.id,
	name: 'Введите название',
	name_lat: 'Введите латинское название',
	url: 'Вставте ссылку на википедию',
	img: read_pict(fs.readFileSync('./test_data/testdb.jpg'))  };
	res.render('editRecord', { title: 'Создание новой записи', cursor: cursor, imgfile: 'old' });
});
	

module.exports = router;
