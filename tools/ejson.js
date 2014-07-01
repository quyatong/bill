/**
 * [format description]
 * @param  {[type]} res
 * @return {[type]}
 */
exports.format = function (res) {
	res = res || {};
	return JSON.stringify({
		status: res.status || 0,
		data: res.data || {},
		statusInfo: res.statusInfo || {}
	});
}