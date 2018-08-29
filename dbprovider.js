const fs = require('fs');
const btoa = require('btoa');

const mongodb = require('mongodb');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'localhost';
const dbPort = 27017;
const dbName = 'Test';
const collName = 'Garden_Plant';
const collTmp = 'temp_pict';
//const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

// Обработка изображения в буффере для сохранения в mongodb
const read_pict = (buff) => {
	return btoa(String.fromCharCode(...new Uint8Array(buff)))
};
// Данные для тестовой загрузки
const dbplant = [ 
	{	name: 'Ромашка',	
		name_lat: 'Matricaria', 
		url: 'https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D0%BC%D0%B0%D1%88%D0%BA%D0%B0',
		img: read_pict(fs.readFileSync('./test_data/pic001.jpg')) },
	{	name: 'Дудник',	
		name_lat: 'Angélica', 
		url: 'https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%B4%D0%BD%D0%B8%D0%BA',
		img: read_pict(fs.readFileSync('./test_data/pic002.jpg')) },
	{	name: 'Земляника',	
		name_lat: 'Fragária', 
		url: 'https://ru.wikipedia.org/wiki/%D0%97%D0%B5%D0%BC%D0%BB%D1%8F%D0%BD%D0%B8%D0%BA%D0%B0',
		img: read_pict(fs.readFileSync('./test_data/pic003.jpg')) },
	{	name: 'Иван-да-марья',	
		name_lat: 'Melampýrum nemorósum', 
		url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%80%D1%8C%D1%8F%D0%BD%D0%BD%D0%B8%D0%BA_%D0%B4%D1%83%D0%B1%D1%80%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9',
		img: read_pict(fs.readFileSync('./test_data/pic004.jpg')) },
	{	name: 'Осот',	
		name_lat: 'Sónchus', 
		url: 'https://ru.wikipedia.org/wiki/%D0%9E%D1%81%D0%BE%D1%82',
		img: read_pict(fs.readFileSync('./test_data/pic005.jpg')) }
];
// Функция для подключения к БД
const doItDB = (func) => {
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
		if (err) { throw err;} 
		const db = client.db(dbName); 
		console.log('run func')
		func(db, client);
	});
};
// Очистка БД и загрузка тестовых данных
const AddDefDB = (finfunc) => {
	const defdb = (db, cli) => {
		db.collections(function(err, coll){
			if (coll.find(e => e.s.name === collName)) {
				db.collection(collName).drop(function(err, ok){
					if (err) { console.log('Collection not deleted'); }
					if (ok) { console.log('Collection deleted'); }
				});
			}	else { console.log('Collection not found');};
			db.collection(collName).insertMany(dbplant, function(err, resdb){
				if (err) {throw err;}
				console.log('Added', err, resdb.insertCount)
				cli.close();
				finfunc();
			});
		});	
	}
	doItDB(defdb);
};
// Удаление одной записи из БД 
const delRecord = (id, finfunc) => {
	const dr = (db, cli) => {
		let myquery = {_id : new mongodb.ObjectID(id)};
		db.collection(collName).deleteOne(myquery, (err, obj) => {
			assert.equal(null, err);
			assert.equal(1, obj.deletedCount);
			console.log('1 document deleted');
			cli.close();
			finfunc();
		});
	};
	doItDB(dr);
};



module.exports = {
	doItDB: doItDB,
	AddDefDB: AddDefDB,
	delRecord: delRecord,
	read_pict: read_pict,
	collName: collName,
	collTmp: collTmp
}
