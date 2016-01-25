
/*
 * GET login page.
 */

exports.main = function(req, res, next) {
	
	var userData = {
			loginId : req.session.user.loginId
			,userName : req.session.user.userName
	}
	console.log(userData);
	res.render('home/main', {user: userData});
};


