/*
 * POST ADD USER
 */
exports.add = function(req, res, next) {
	//temp data
	var info = req.body;
	var loginId = info.loginId;
	req.models.User.findOne({loginId: loginId}, function(error, result) {
	    if (error) return next(error);
	    console.info(result);
	    if(result){
	    	req.models.User.remove({loginId: loginId}, function(error, result){
	    		if (error) return next(error);
	    	});
	    	
	    }
	    req.models.User.create(info, function(error, addResponse) {
    	    if (error) return next(error);
    	    console.info(addResponse);
    	    res.send(addResponse);
    	});
	    
	});
};