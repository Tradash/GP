var express = require('express');
var router = express.Router();
const AddDefDB = require('../dbprovider.js').AddDefDB;


//console.log(AddDefDB);
router.get('/', function(req, res, next) {
	AddDefDB((err)=>{
		if (err) { return next(err); }; 
		res.redirect('/');
	});
});

module.exports=router;
	


