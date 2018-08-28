var express = require('express');
var router = express.Router();


// === begin my kod
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
const show_max = 3;

router.get('/', function(req, res, next) {
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('Connected successfully to DB');
		const db = client.db(dbName);
		db.collection(collName).find({}).toArray(function(err, cursor){
			if (err) { throw err; }
				else if (cursor.length) {
					/* GET home page. */
					console.log(cursor.length, cursor[0]._id);
					res.render('index', { title: 'Тестовое приложения', cursor: cursor });
				}
					else {
						console.log('No document in DB')
					  res.render('index', { title: 'Тестовое приложения, База пуста', cursor : null });
					}
			client.close;
		});		
	});
});

module.exports = router;
