var imageData = require('../models/image');
var registerData = require('./registerData');

function compareImageData(id, x, y, w, h, c, r){

    new Promise(function(resolve,reject){
		var compareCondition = {"labelClass": c};
		
		imageData.find(compareCondition)
		.then(function(foundDatas){
			// console.log('found data:', foundDatas);
			// ---delete---
			imageData.deleteMany(compareCondition)
			.then(function(removedDatas){
				console.log('completely removed');
				// ---register new---
				registerData(id, x, y, w, h, c, r);
				
			})
			.catch(function(err){
				console.log(err);
			});
			

			
		})
		.catch(function(err){
			console.log(err);
		});

		
		

    });
    
}
module.exports = compareImageData;
