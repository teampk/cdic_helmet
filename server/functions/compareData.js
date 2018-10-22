var imageData = require('../models/image');
var registerData = require('./registerData');

function compareImageData(id, x, y, w, h, c, r){

    new Promise(function(resolve,reject){
		var compareCondition = { $and:[{"labelClass": c}, 
		{"labelRatio": {$gt:r-1, $lt:r+1}}
		]};
		
		imageData.find(compareCondition)
		.then(function(foundDatas){
			console.log('found data:', foundDatas);
			// --- delete ---
			imageData.deleteMany(compareCondition)
			.then(function(removedDatas){
				console.log('removed');
				// --- register new data ---
				registerData(id, x, y, w, h, c, r);
				
			})
			.catch(function(err){
				console.log(err);
			});
		})
		.catch(function(err){
			console.log(err);
		});

		console.log('if not');

		
		

    });
    
}
module.exports = compareImageData;
