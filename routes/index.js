var express = require('express');
var router = express.Router();


// === begin my kod
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
const show_max = 3;
let myquery;

router.get('/', function(req, res, next) {
	if(req.query.f) { myquery = {'$or': [ {name: { '$regex' : req.query.f, '$options': 'i' }}, 
																			  {name_lat: { '$regex' : req.query.f, '$options': 'i' }}]}}
		else { myquery = {};}
	console.log('*****', myquery, req.ip);
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('Connected successfully to DB');
		const db = client.db(dbName);
		db.collection(collName).find(myquery).toArray(function(err, cursor){
			if (err) { throw err; }
				else if (cursor.length) {
					db.collection(collName).count(function(err, colrec){
						res.render('index', { title: 'Тестовое приложениe', cursor: cursor, bdcount: colrec, bdshow: cursor.length  });
						client.close;
					});
				}
					else {
						console.log('No document in DB')
					  res.render('index', { title: 'Тестовое приложения, База пуста', cursor: null, bdcount: 0, bdshow: 0 });
					  client.close;
					}
		});		
	});
});

module.exports = router;
