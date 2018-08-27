//const Db = require('mongodb').Db
//const Connection = require('mongodb').Connection;
//const Server = require('mongodb').Server;
//const BSON = require('mongodb').BSON;

const fs = require('fs');
const btoa = require('btoa');

const mongodb = require('mongodb');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const dbUrl = 'localhost';
const dbPort = 27017;
const dbName = 'Test';
const collName = 'Garden_Plant';
//const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';

const read_pict = (file) => {
	return btoa(String.fromCharCode(...new Uint8Array(fs.readFileSync(file))));
};

const dbplant = [
	{	name: 'Ромашка',	
		name_lat: 'Matricaria', 
		url: 'https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D0%BC%D0%B0%D1%88%D0%BA%D0%B0',
		img: read_pict('./test_data/pic001.jpg') },
	{	name: 'Дудник',	
		name_lat: 'Angélica', 
		url: 'https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%B4%D0%BD%D0%B8%D0%BA',
		img: read_pict('./test_data/pic002.jpg') },
	{	name: 'Земляника',	
		name_lat: 'Fragária', 
		url: 'https://ru.wikipedia.org/wiki/%D0%97%D0%B5%D0%BC%D0%BB%D1%8F%D0%BD%D0%B8%D0%BA%D0%B0',
		img: read_pict('./test_data/pic004.jpg') },
	{	name: 'Иван-да-марья',	
		name_lat: 'Melampýrum nemorósum', 
		url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%80%D1%8C%D1%8F%D0%BD%D0%BD%D0%B8%D0%BA_%D0%B4%D1%83%D0%B1%D1%80%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9',
		img: read_pict('./test_data/pic005.jpg') },
	{	name: 'Осот',	
		name_lat: 'Sónchus', 
		url: 'https://ru.wikipedia.org/wiki/%D0%9E%D1%81%D0%BE%D1%82',
		img: read_pict('./test_data/pic003.jpg') }
];

const doItDB = (func) => {
	MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
		if (err) { throw err;} 
		const db = client.db(dbname); 
		func(db);
		client.close();
	});
};
	
const AddDefDB = () => {
	const defdb = (db) => {
		db.collection(collName).drop(function(err, ok){
			if (err) { console.log('Collection not found'); }
			if (ok) { console.log('Collection deleted'); }
		});
		db.collection(collName).insertMany(dbplant, function(err, resdb){
			if (err) {throw err;}
			console.log('Added', resdb.insertCount)
		});
	}
	doItDB(defdb);
};

module.export = {
	doItDB: doItDB
	AddDefDB: AddDefDB
}
/*
module.export = myMongoDbProvider;


const dbprovider = function() {
	this.db = new Db(dbName, new Server(dbUrl, dbPort, {safe:false}, {auto_reconnect: true}, {}));
//	this.db.open(function(){});
};

dbprovider.prototype.getCollection = function(callback){
	this.db.collection(collName, (err, coll) => {
		if (err) {callback(err);}
			else { callback(null, coll)};
	});
};

dbprovider.prototype.defbase = function(callback) {
	this.getCollection((err, coll) => {
	console.log(coll);
//		if (coll.find(e => e.s.name === collName)) { 
//				console.log('Found Collection');
				coll.drop(function(err, ok) {
					if (err){ callback(err); }
					if (ok) { console.log('Collection deleted')}
				});
//			};
		coll.insertMany(dbplant, function(err, resdb){ 
				if (err) { callback(err); }
				console.log('Added', resdb.insertedCount); 
		});
	});
};


module.exports = dbprovider;

*/
