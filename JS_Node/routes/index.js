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
	var userData = {
			loginId : req.session.user.loginId
			,userName : req.session.user.userName
	}
	console.log(userData);
	res.render('admin', {user: userData});
};

