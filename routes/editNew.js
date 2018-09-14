const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const multer = require('multer');

const fs = require('fs');
const doItDB = require('../dbprovider.js').doItDB;
const loadFR = require('../dbprovider.js').loadFR;
const readPict = require('../dbprovider.js').readPict;
const collName = require('../dbprovider.js').collName;
const collTmp = require('../dbprovider.js').collTmp;

const storage = multer.memoryStorage();
const upload = multer({storage});
let myquery;

// upload.single('image'),
router.post('/:idd', upload.single('img'), function(req, res, next) {
  doItDB((err, db, cli)=>{
    if (err) {
      return next(err);
    }
    const id = req.params.idd;
    if (!req.body.name) {
      // Сохранение изображения во временной базе

      loadFR([req.file.buffer]).then((elem) => {
        const buff = readPict(elem[0]);
        db.collection(collTmp).insertOne({idold: id, img: buff}, (err, rez) => {
          if (err) {
            // eslint-disable-next-line
            const error = new Error('Ошибка при сохранении изображения во временной БД');
            error.httpStatusCode = 400;
            return nexr(error);
          }
        });
        const cursor = {
          _id: id,
          name: 'Введите название',
          name_lat: 'Введите латинское название',
          url: 'Вставте ссылку на википедию',
          img: buff};
        // Создание формы для ввода оставшихся полей
        res.render('editRecord', {
          title: 'Редактирование новой записи (изображение загружено)',
          cursor: cursor,
          imgfile: 'newnew'});
        cli.close();
      });
    } else {
      doItDB((err, db, cli)=>{
        if (err) {
          return next(err);
        }
        myquery = {idold: id};
        // Забираем изображение из временного хранилища
        db.collection(collTmp).findOne(myquery, function(err, doc) {
          if (err) {
            // eslint-disable-next-line
            const error = new Error('Ошибка при загрузке изображения из временной БД');
            error.httpStatusCode = 400;
            return nexr(error);
          } else {
            const newRec = {
              name: req.body.name,
              name_lat: req.body.name_lat,
              url: req.body.url,
              img: doc.img,
            };
            // Сохраняем запись в БД
            db.collection(collName).insert(newRec,
                function(err, r) {
                  if (err) {
                    const error = new Error('Ошибка при вставке записи в БД');
                    error.httpStatusCode = 400;
                    return nexr(error);
                  } else {
                    // Удаляем изображение из временного хранилища
                    myquery = {idold: id};
                    db.collection(collTmp).deleteMany(myquery,
                        function(err, r) {
                          if (err) {
                            // eslint-disable-next-line
                            const error = new Error('Ошибка при удалении изображения из временной БД');
                            error.httpStatusCode = 400;
                            return nexr(error);
                          } else {
                            cli.close;
                            res.redirect('/');
                          };
                        });
                  }
                });
          };
        });
      });
    }
  });
});

router.get('/:id', function(req, res, next) {
  const cursor = {
    _id: id = req.params.id,
    name: 'Введите название',
    name_lat: 'Введите латинское название',
    url: 'Вставте ссылку на википедию',
    img: readPict(fs.readFileSync('./test_data/testdb.jpg'))};
  res.render('editRecord',
      {title: 'Создание новой записи',
        cursor: cursor,
        imgfile: 'old'});
});


module.exports = router;
