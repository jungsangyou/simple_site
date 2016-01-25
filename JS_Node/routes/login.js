


/*
 * GET login page.
 */

exports.login = function(req, res, next) {
	res.render('login/login');
};


/*
 * GET logout route.
 */

exports.logout = function(req, res, next) {
	req.session.destroy();
	res.redirect('/login');
};



exports.authenticate = function(req, res, next) {
	if(!req.query.loginId) {
		console.info("id 파라메타를 보내주세요")
		return;
	}
	var loginId = req.query.loginId;
	var password = req.query.password
	req.collections.users.findOne({loginId: loginId, password : password}, function(error, result) {
	    if (error) return next(error);
	    console.info(result);
	    req.session.user = result;
		req.session.admin = result.admin;
	    res.send(result);
	    
	});
	
}