var express = require('express');
var router = express.Router();

var ps = require('python-shell');
var resultPython;
var mongoose = require ('mongoose');
var tracking = require('../functions/tracking');
var registerData = require('../functions/registerData');
var compareData = require('../functions/compareData');

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
        console.log('--- Python Results: %j', resultPython);
        console.log('--- Python Errors: %j', err);

        function getResultRasp(){
          return new Promise(function(resolve, reject){
            var responseRasp='';
            var loop=0;
            if (!resultPython){
              resolve('none');
            }
            else{
              for (var result in resultPython){
                var data = new Array();
                for (var i=0;i<6;i++){
                  data[i] = resultPython[result].split(' ')[i];
                }
                // labeRatio -> Label 너비 / 높이
                var labelRatio = parseFloat(data[3])/parseFloat(data[4]);
                var randomCreatedId = randomId();
                console.log('data->', randomCreatedId, parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]), parseFloat(data[4]), data[5], labelRatio);
                // result 에 대해서 db내에 있는 element 들과 비교 후, 범위 내에 있으면 대체
                compareData(randomCreatedId, parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]), parseFloat(data[4]), data[5], labelRatio)
                .then(function(result){
                  responseRasp += (result+'/');
                  loop++;
                  if (loop==resultPython.length){
                    resolve(responseRasp);
                  }
                })
                .catch(function(err){
                  console.log(err);
                });
            }}
          });
        }

        getResultRasp().then(function(finalData){
          res.send(finalData);
          console.log('--final--:', finalData);
        })
        .catch(function(err){
          console.log('final error:',err);
        });   
      });
    }
  });
});

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

var randomId = function()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
};

module.exports = router;
