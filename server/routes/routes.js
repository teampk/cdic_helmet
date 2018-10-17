var express = require('express');
var router = express.Router();

var ps = require('python-shell');
var resultPython;
var mongoose = require ('mongoose');

var auth = require('basic-auth');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');

var options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: './python-code',
  args: ['value1', 'value2']
};


router.get('/', function(req,res){
  res.send('this is user page');

});
router.get('/process', function(req,res){
  options.args[0] = 'inputImage.png';
  options.args[1] = 'dog3';

  ps.PythonShell.run('imageProcessing.py', options, function (err, resultPython) {
      if (err) throw err;
      console.log('Results: %j', resultPython);
      console.log('Errors: %j', err);
    });

    res.send('python code is sent! Check out the log');
});

module.exports = router;
