/*
 * POST ADD USER
 */
exports.add = function(req, res, next) {
	//temp data
	var info = req.body;
	var loginId = info.loginId;
	console.info(info);
	req.collections.users.findOne({loginId: loginId}, function(error, result) {
	    if (error) return next(error);
	    if(result){
	    	req.collections.users.remove({loginId: loginId}, function(error, result){
	    		if (error) return next(error);
	    	});
	    	
	    }
	    req.collections.users.insert(info, function(error, articleResponse) {
    	    if (error) return next(error);
    	    res.send(articleResponse);
    	});
	    
	});
};