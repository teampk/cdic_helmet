var imageData = require('../models/image');

function registerImageData(id, x, y, w, h, c){
    var newImageData = new imageData({
        dataId: id,
        coordinateX: x,
        coordinateY: y,
        width: w,
        height: h,
        class: c,
        created_at: new Date()
    });
    newImageData.save()
    .then(function(){
        console.log('good');
    })
    .catch(function(err){
        if (err.code == 11000) {

            console.log('errorroro');

        } else {

            console.log('ooo');
        }
    });


}
module.exports = registerImageData;

/*
exports.registerImageData = (id, x, y, w, h, c) =>

	new Promise(function(resolve,reject){

		var newImageData = new imageData({
            dataId: id,
			coordinateX: x,
			coordinateY: y,
			width: w,
			height: h,
            class: c,
            created_at: new Date()
		});

		newImageData.save()

		.then(function(){
			resolve({ status: 201, message: 'Image Data Registered' });
		})

		.catch(function(err){

			if (err.code == 11000) {

				reject({ status: 409, message: 'Already Registered !' });

			} else {

				reject({ status: 500, message: 'Internal Server Error !' });
			}
		});
    });
*/
