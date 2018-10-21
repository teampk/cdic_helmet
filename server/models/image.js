var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageDataSchema = mongoose.Schema({
    dataId : {type: String, unique: true},
    coordinateX     : String,
    coordinateY 	: String,
	width   : String,
	height  : String,
    class    : String,
	created_at  : String
});

module.exports = mongoose.model('imageData', imageDataSchema);
