var mongoose = require('mongoose')
    , Schema = mongoose.Schema;

var uploadSchema = mongoose.Schema({
    title: String,
    date : { type: Date, default: Date.now },
    content: String
});

var Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload;
