/*
 * GET admin home page.
 */
exports.admin = function(req, res, next) {
	var userData = {
			loginId : req.session.user.loginId
			,userName : req.session.user.userName
	}
	console.log(userData);
	res.render('admin/admin', {user: userData});
};

/*
 * GET admin add page.
 */
exports.add = function(req, res, next) {
	res.render('admin/add');
};