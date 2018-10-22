var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var imageDataSchema = mongoose.Schema({
    dataId : {type: String, require: true, unique: true},
    coordinateX     : {type: Number, require: true},
    coordinateY 	: {type: Number, require: true},
	labelWidth   : {type: Number, require: true},
	labelHeight  : {type: Number, require: true},
    labelClass    : {type: String, require: true},
    labelRatio : {type: Number, require: true},
	created_at  : String
});

module.exports = mongoose.model('imageData', imageDataSchema);
