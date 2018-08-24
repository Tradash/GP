const fs = require('fs');
const btoa = require('btoa');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const read_pict = (file) => {
	return btoa(String.fromCharCode(...new Uint8Array(fs.readFileSync(file))));
};

exports.create_test = function (url, dbName, collName) {
//	const url = 'mongodb://localhost:27017';
//	const dbName = 'Test';
//	const collName = 'Garden_Plant';
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
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('Connected successfully to server');
		const db = client.db(dbName);
		db.collections(function(err, coll){
			if (coll.find(e => e.s.name === collName)) { 
				console.log('Found');
				db.collection(collName).drop(function(err, ok) {
					if (err){ throw err; }
					if (ok) { console.log('Collection deleted')}
				});
			};
			db.collection(collName).insertMany(dbplant, function(err, res){ 
				if (err) { throw err; }
				console.log('Added', res.insertedCount); 
				client.close();
			});
		});		
	});
};

//export default create_test;
	


