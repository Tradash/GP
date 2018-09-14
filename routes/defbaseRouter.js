const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const addDefDB = require('../dbprovider.js').addDefDB;


// console.log(AddDefDB);
router.get('/', function(req, res, next) {
  addDefDB((err)=>{
    if (err) {
      return next(err);
    };
    res.redirect('/');
  });
});

module.exports=router;


