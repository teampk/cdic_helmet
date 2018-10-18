var express = require('express');
var router = express.Router();

var ps = require('python-shell');
var resultPython;
var mongoose = require ('mongoose');

var auth = require('basic-auth');
var jwt = require('jsonwebtoken');
var fs = require('fs');
var path = require('path');
var multer = require('multer');

var options = {
  mode: 'text',
  pythonPath: '',
  pythonOptions: ['-u'],
  scriptPath: './python',
  args: ['value1', 'value2']
};

router.get('/', function(req,res){
  res.send('this is user page');
});

router.post('/process', function(req,res){
  upload(req, res, function(err){
    if (err) {
      console.log(err);
      res.status(400).json({
        message: err.message
      });
    } else {
      var filename = req.files[0].originalname;

      // 기기 id
      options.args[0] = 'helmet32';
      // 사진 정보 (찍은 날짜, 시간)
      options.args[1] = filename;

      ps.PythonShell.run('imageProcessing.py', options, function (err, resultPython) {
          if (err) throw err;
          console.log('Results: %j', resultPython);
          console.log('Errors: %j', err);
        });
        res.send('python code is sent! Check out the log');
    }
  });
});

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      console.log('original name: ', file.originalname);
      var folderPath = './public/images/input_image/';
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
  }),
  limits: {
    fileSize: 10000000,
    files: 1
  },
  fileFilter: function(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only Images are allowed !'), false);
    }
    callback(null, true);
  }
}).any();

module.exports = router;
