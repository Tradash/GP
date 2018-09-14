const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const urldb = require('../dbprovider.js').url;
const dbName = require('../dbprovider.js').dbName;
const collName = require('../dbprovider.js').collName;
let myquery;
let filterInfo;

router.get('/', function(req, res, next) {
  if (req.query.f) {
    myquery = {'$or': [{name: {'$regex': req.query.f, '$options': 'i'}},
      {name_lat: {'$regex': req.query.f, '$options': 'i'}}]};
    filterInfo = 'Установлен фильтр: << '+req.query.f+' >>';
  } else {
    myquery = {};
    filterInfo='Фильтр не установлен';
  }
  console.log('*****', myquery, req.ip);
  MongoClient.connect(urldb, {useNewUrlParser: true}, function(err, client) {
    if (err) {
      const error = new Error('Ошибка при соединении с БД');
      error.httpStatusCode = 400;
      return next(error);
    }
    console.log('Connected successfully to DB');
    const db = client.db(dbName);
    db.collection(collName).find(myquery).toArray(function(err, cursor) {
      if (err) {
        const error = new Error('Ошибка при соединении с коллекцией');
        error.httpStatusCode = 400;
        return next(error);
      } else if (cursor.length) {
        db.collection(collName).count(function(err, colrec) {
          if (err) {
            // eslint-disable-next-line
            const error = new Error('Ошибка при подсчете количества записей в БД');
            error.httpStatusCode = 400;
            return next(error);
          }
          res.render('index', {title: 'Тестовое приложениe',
            cursor: cursor,
            bdcount: colrec,
            bdshow: cursor.length,
            filterInfo: filterInfo});
          client.close;
        });
      } else {
        console.log('No document in DB');
        res.render('index',
            {title: 'Тестовое приложения, База пуста',
              cursor: null,
              bdcount: 0,
              bdshow: 0,
              filterInfo: filterInfo});
        client.close;
      }
    });
  });
});

module.exports = router;
