var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
//  namespace = require('express-namespace'),
  mongoskin = require('mongoskin'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/jsy',
  db = mongoskin.db(dbUrl, {safe: true}),
  collections = {
	users: db.collection('users'),
  };
var everyauth = require('everyauth');
var global = {};
var session = require('express-session'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

//everyAuth With google 연계 
everyauth.google
.appId("900717034966-rk27187rinune8jgdjq11gab9khor9gp.apps.googleusercontent.com")
.appSecret("ldlHWdm23ScE2-P8gN3WxbzU")
.scope('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
.findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
	  try{
		  //집에서 하기로 !!
		  var promise = this.Promise();
		  console.log(fbUserMetadata);
	  	  promise.fulfill(fbUserMetadata);
	  	  return promise;
	 }catch(err){
		  console.log(err);
	 }
})
.redirectPath('/login');
everyauth.everymodule.handleLogout(routes.login.logout);
everyauth.everymodule.findUserById(function(user, callback){
	callback(user);
});


var app = express();
app.locals.appTitle = 'jsNode';

//app.use(app.router);
app.use(function(req, res, next) {
	if (! collections.users) return next(new Error("No collections users."))
	req.collections = collections;
	return next();
});

app.set('port',  process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride());
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

//쿠키 세션 설정 
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C4477FA-D649-4D44-9535-46E296EF984F'}));
app.use(everyauth.middleware());

app.use(function(req, res, next){
	if(req.session && req.session.admin) res.locals.admin = true;
	next();
});

//세션 권한 설정 
var auth_admin = function(req, res, next) {
	if(req.session && req.session.admin) return next();
	else return res.redirect('login');
}

var auth_user = function(req, res, next) {
	if(req.session) return next();
	else return res.redirect('login');
}

//세션 체크
var chkSession = function(req, res, next) {
	if(req.session) return next();
	else return res.redirect('login');
} 


//development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

//setting contextPath
//app.namespace('/jsy', function() {
//    app.get('/', function (req, res) {
//    	res.send(404);
//    });
//});

// Pages and routes
app.get('/', function(req, res) {
	res.redirect('login');
});

//로그인 화면 
app.get('/admin', auth_admin, routes.admin);
app.get('/login', routes.login.login);
app.get('/logout', routes.login.logout);

//메인홈 
app.get('/home/main', auth_user, routes.home.main);

// REST API routes
//사용자 정보 조회 
app.get('/api/authenticate/', routes.login.authenticate);
app.post('/api/addUser/', auth_admin, routes.user.add);

app.all('*', function(req, res) {
	res.send(404);
});


var server = http.createServer(app);
var boot = function () {
	server.listen(app.get('port'), function(){
		console.info('Express server listening on port ' + app.get('port'));
	});
}
var shutdown = function() {
	server.close();
}
if (require.main === module) {
	boot();
} else {
	console.info('Running app as a module');
	exports.boot = boot;
	exports.shutdown = shutdown;
	exports.port = app.get('port');
}
