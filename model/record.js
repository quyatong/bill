var mongoose = require('mongoose');

// 记录
var RecordSchema = mongoose.Schema({
    outerId: String,
    time: String,
    money: String,
    customers: [
        String
    ],
    comment: String
});
var Record = mongoose.model('Record', RecordSchema);

module.exports = Record;