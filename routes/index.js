var express = require('express');
var router = express.Router();


// === begin my kod
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
const show_max = 3;

// === begin my kod
const create_test = require('./create_test.js').create_test;

// Заполняем базу дефолтными данными для тестов
//create_test(url, dbName, collName);
// === end my kod

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
	assert.equal(null, err);
	console.log('Connected successfully to DB');
	const db = client.db(dbName);
	
	db.collection(collName).find({}).toArray(function(err, cursor){
		if (err) { throw err; }
			else if (cursor.length) {
			/* GET home page. */
			console.log(cursor.length);
			router.get('/', function(req, res, next) {
  			res.render('index', { title: 'Тестовое приложения', cursor: cursor });
			});
		} else {console.log('No document in DB')}
	});

	client.close;
});		

// === end my kod
/*
			td 
				Наименование: <strong>#{item.name}</strong> <br/>  Латинское наименование: <strong>#{item.name_lat}</strong> <br/> a(href = item.url) Википедия
*/



module.exports = router;
