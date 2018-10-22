var imageData = require('../models/image');

function registerImageData(id, x, y, w, h, c, r){
    var newImageData = new imageData({
        dataId: id,
        coordinateX: x,
        coordinateY: y,
        labelWidth: w,
        labelHeight: h,
        labelClass: c,
        labelRatio: r,
        created_at: new Date()
    });
    newImageData.save()
    .then(function(){
        console.log('completely registered, id:', id);
    })
    .catch(function(err){
        if (err.code == 11000) {
            console.log('---error code 11000---');
            console.log(err);
        } else {
            console.log('---error else---');
            console.log(err);
        }
    });
}
module.exports = registerImageData;
