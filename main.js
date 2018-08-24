const express = require('express');
const app = express();

const fs = require('fs');
const assert = require('assert');
const create_test = require('./create_test.js').create_test;
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
console.log(create_test);
// Заполняем базу дефолтными данными для тестов
create_test(url, dbName, collName);
//Запускаем сервер
app.get('/', function (req, res) {
	res.send('Hello World!')
});
app.listen(3000, function() {
	console.log('App on 3000 port');	
});


