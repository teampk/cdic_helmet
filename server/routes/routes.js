var express = require('express');
var router = express.Router();

var ps = require('python-shell');
var resultPython;
var mongoose = require ('mongoose');
var tracking = require('../functions/tracking');
var registerData = require('../functions/registerdata');

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
      // 기기 id
      options.args[0] = 'helmet32';
      // 사진 정보 (찍은 날짜, 시간)
      // options.args[1] = req.files[0].originalname;
      options.args[1] = 'rasp_input_image.jpg';

      ps.PythonShell.run('imageProcessing.py', options, function (err, resultPython) {
          if (err) throw err;
          console.log('Results: %j', resultPython);
          console.log('Errors: %j', err);
          console.log(randomId(), resultPython[0].split(' ')[1], resultPython[0].split(' ')[2], resultPython[0].split(' ')[3], resultPython[0].split(' ')[4], resultPython[0].split(' ')[5]);
          
          registerData(randomId(), resultPython[0].split(' ')[1], resultPython[0].split(' ')[2], resultPython[0].split(' ')[3], resultPython[0].split(' ')[4], resultPython[0].split(' ')[5]);
          
          /*
          for (var result in resultPython){
            var data = new Array();
            for (var i=0;i<6;i++){
              data[i] = resultPython[result].split(' ')[i];
            }
            registerdata.registerImageData(randomId(), data[1], data[2], data[3], data[4], data[5])
            .catch(function(err) {
              console.log(err);
              
              res.status(err.status).json({
                message: err.message
              });
              
            });
          }
          */
        });
        res.send('python code is sent! Check out the log');
    }
  });
});

var randomId = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

var upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      // console.log('original name: ', file.originalname);
      var folderPath = './public/images/input_image/';
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, 'rasp_input_image.jpg');
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
