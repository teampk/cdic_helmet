var express = require('express');
var router = express.Router();

var auth = require('basic-auth');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

router.get('/', function(req,res){
  res.send('this is user page');

});

module.exports = router;
