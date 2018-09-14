const express = require('express');
// eslint-disable-next-line
const router = express.Router();
const delRecord = require('../dbprovider.js').delRecord;

// === begin my kod

// const show_max = 3;

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  delRecord(id, (err)=>{
    if (err) {
      return next(err);
    };
    res.redirect('/');
  });
});

module.exports = router;
