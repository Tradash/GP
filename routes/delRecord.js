var express = require('express');
var router = express.Router();
var mongodb = require('mongodb');

// === begin my kod
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
//const show_max = 3;

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
		assert.equal(null, err);
		console.log('Connected successfully to DB for delete');
		const dbo = client.db(dbName);
		let myquery = {_id : new mongodb.ObjectID(id)};
		dbo.collection(collName).deleteOne(myquery, (err, obj) => {
			assert.equal(null, err);
			assert.equal(1, obj.deletedCount);
			console.log('1 document deleted');
			client.close();
			res.redirect('/');
		})
	});
});

module.exports = router;