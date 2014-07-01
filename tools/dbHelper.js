var mongoose = require('mongoose');
var when = require('when');
var promise = when.defer();
var isOpened = false;

mongoose.connect('mongodb://localhost:27017/data');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  isOpened = true;
  promise.resolve();
});

exports.open = function () {
	if (isOpened) {
		setTimeout(function () {
			promise.resolve();
		}, 0);
	}
	return promise.promise;
}