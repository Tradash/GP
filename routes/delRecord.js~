var express = require('express');
var router = express.Router();
const delRecord = require('../dbprovider.js').delRecord;

// === begin my kod

//const show_max = 3;

router.get('/:id', function(req, res, next) {
	const id = req.params.id;
	delRecord(id, ()=>{res.redirect('/')});
});

module.exports = router;
