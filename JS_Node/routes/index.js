exports.user = require('./user');
exports.login = require('./login');
exports.home = require('./home');
exports.admin = require('./admin');
/*
 * GET home page.
 */
exports.index = function(req, res, next) {
	res.redirect('login');
};