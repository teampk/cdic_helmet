var imageData = require('../models/image');

function registerImageData(id, x, y, w, h, c, r){
    return new Promise(function(resolve, reject){
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
            // --- new data ---
            console.log('completely registered, id:', id);
    
            if (w > 960 || h > 720){
                resolve('detect_near('+ c +')('+w+'x'+h+')');
            }else{
                reject('detect_far('+ c +')('+w+'x'+h+')');
            }
    
    
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
    });
}
module.exports = registerImageData;
