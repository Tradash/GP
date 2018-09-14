const mongodb = require('mongodb');
const MongoClient = require('mongodb').MongoClient;
const sharp = require('sharp');

const url = 'mongodb://localhost:27017';
const dbName = 'Test';
const collName = 'Garden_Plant';
const collTmp = 'temp_pict';

// Данные для тестовой загрузки
const dbplant = [
  {name: 'Ромашка',
    name_lat: 'Matricaria',
    url: 'https://ru.wikipedia.org/wiki/%D0%A0%D0%BE%D0%BC%D0%B0%D1%88%D0%BA%D0%B0'},
  {name: 'Дудник',
    name_lat: 'Angélica',
    url: 'https://ru.wikipedia.org/wiki/%D0%94%D1%83%D0%B4%D0%BD%D0%B8%D0%BA'},
  {name: 'Земляника',
    name_lat: 'Fragária',
    url: 'https://ru.wikipedia.org/wiki/%D0%97%D0%B5%D0%BC%D0%BB%D1%8F%D0%BD%D0%B8%D0%BA%D0%B0'},
  {name: 'Иван-да-марья',
    name_lat: 'Melampýrum nemorósum',
    url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%B0%D1%80%D1%8C%D1%8F%D0%BD%D0%BD%D0%B8%D0%BA_%D0%B4%D1%83%D0%B1%D1%80%D0%B0%D0%B2%D0%BD%D1%8B%D0%B9'},
  {name: 'Осот',
    name_lat: 'Sónchus',
    url: 'https://ru.wikipedia.org/wiki/%D0%9E%D1%81%D0%BE%D1%82'},
  {name: 'Смородина красная',
    name_lat: 'Ríbes rúbrum',
    url: 'https://ru.wikipedia.org/wiki/%D0%A1%D0%BC%D0%BE%D1%80%D0%BE%D0%B4%D0%B8%D0%BD%D0%B0_%D0%BA%D1%80%D0%B0%D1%81%D0%BD%D0%B0%D1%8F'},
  {name: 'Можжевельник распростёртый',
    name_lat: 'Juníperus horizontális',
    url: 'https://ru.wikipedia.org/wiki/%D0%9C%D0%BE%D0%B6%D0%B6%D0%B5%D0%B2%D0%B5%D0%BB%D1%8C%D0%BD%D0%B8%D0%BA_%D1%80%D0%B0%D1%81%D0%BF%D1%80%D0%BE%D1%81%D1%82%D1%91%D1%80%D1%82%D1%8B%D0%B9'},
  {name: 'Барбарис',
    name_lat: 'Bérberis',
    url: 'https://ru.wikipedia.org/wiki/%D0%91%D0%B0%D1%80%D0%B1%D0%B0%D1%80%D0%B8%D1%81'},
];
let fname = [];
for (let i = 1; i < 9; i += 1) {
  fname = [...fname, './test_data/pic00' + i + '.jpg'];
}

// Обработка изображения в буффере для сохранения в mongodb
const readPict = (buff) => {
  return Buffer.from(buff).toString('base64');
};
// Загрузка изображения в буфер и проведение ресайзинга
const loadFR = (name) => {
  const prms = name.map((elem) => sharp(elem)
      .resize(300, 300).max().toBuffer());
  return Promise.all(prms);
};

// Функция-обертка для подключения к БД
const doItDB = (func) => {
  MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
    if (err) {
      const error = new Error('Ошибка при соединении с БД');
      error.httpStatusCode = 400;
      return func(error);
    }
    const db = client.db(dbName);
    func(null, db, client);
  });
};
// Очистка БД и загрузка тестовых данных
const addDefDB = (finfunc) => {
  const defdb = (err, db, cli) => {
    if (err) {
      return finfunc(err);
    };
    db.collections(function(err, coll) {
      if (err) {
        const error = new Error('Ошибка при загрузке тестовых данных в БД');
        error.httpStatusCode = 400;
        return finfunc(error);
      }
      if (coll.find((e) => e.s.name === collName)) {
        db.collection(collName).drop(function(err, ok) {
          if (err) {
            console.log('Collection not deleted');
          }
          if (ok) {
            console.log('Collection deleted');
          }
        });
      } else {
        console.log('Collection not found');
      };
      loadFR(fname).then((elem) => {
        for (let i = 0; i < fname.length; i++) {
          dbplant[i].img = readPict(elem[i]);
        }
        db.collection(collName).insertMany(dbplant, function(err, resdb) {
          if (err) {
            const error = new Error('Ошибка при загрузке тестовых данных в БД');
            error.httpStatusCode = 400;
            return finfunc(error);
          }
          console.log('Added', err, resdb.insertCount);
          cli.close();
          finfunc(null);
        });
      }).catch((err) => {
        const error = new Error('Ошибка при загрузке тестовых изображений');
        error.httpStatusCode = 400;
        console.log(err);
        return finfunc(error);
      });
    });
  };
  doItDB(defdb);
};
// Удаление одной записи из БД
const delRecord = (id, finfunc) => {
  const dr = (err, db, cli) => {
    if (err) {
      return finfunc(err);
    };
    let myquery = {_id: new mongodb.ObjectID(id)};
    db.collection(collName).deleteOne(myquery, (err, obj) => {
      if (err) {
        const error = new Error('Ошибка при удалении записи');
        error.httpStatusCode = 400;
        return finfunc(error);
      }
      console.log('1 document deleted');
      cli.close();
      finfunc(null);
    });
  };
  doItDB(dr);
};

module.exports = {
  doItDB: doItDB,
  addDefDB: addDefDB,
  delRecord: delRecord,
  readPict: readPict,
  collName: collName,
  collTmp: collTmp,
  loadFR: loadFR,
  url: url,
  dbName: dbName,
};
