exports.user = require('./user');
exports.login = require('./login');
exports.home = require('./home');

/*
 * GET home page.
 */
exports.index = function(req, res, next) {
	res.redirect('login');
};

/*
 * GET admin home page.
 */
exports.admin = function(req, res, next) {
	res.render('admin');
};

