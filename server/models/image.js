var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageDataSchema = mongoose.Schema({
    coordinateX     : {type: String, require: true},
    coordinateY 	: {type: String, require: true},
	imageWidth   : {type: String, require: true},
	imageHeight  : {type: String, require: true},
    imageClass    : {type: String, require: true},
	created_at  : String
});

module.exports = mongoose.model('imageData', imageDataSchema);
