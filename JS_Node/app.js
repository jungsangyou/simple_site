var express = require('express'),
  routes = require('./routes'),
  http = require('http'),
  path = require('path'),
//  namespace = require('express-namespace'),
//  mongoskin = require('mongoskin'),
  mongoose = require('mongoose'),
  models = require('./models'),
  dbUrl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/jsy',
  db = mongoose.connect(dbUrl, {safe: true}),
  everyauth = require('everyauth');
//  collections = {
//	users: db.collection('users'),
//  };

var global = {count : 1};
var session = require('express-session'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override');

//everyAuth With google �뿰怨� 
everyauth.google
.appId("900717034966-rk27187rinune8jgdjq11gab9khor9gp.apps.googleusercontent.com")
.appSecret("ldlHWdm23ScE2-P8gN3WxbzU")
.scope('https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email')
.findOrCreateUser( function (session, accessToken, accessTokExtra, fbUserMetadata) {
	  try{
		  console.log(fbUserMetadata);
		  //세션 등록하기
		  var usersInfo = {
				  loginId : fbUserMetadata.email
				  ,userName : fbUserMetadata.name
				  ,admin : true
				  ,age : null
				  ,orgName : null
		  }
		  session.user = usersInfo;
		  session.admin = true;
		  var promise = this.Promise();
	  	  promise.fulfill(fbUserMetadata);
	  	  return promise;
	 }catch(err){
		  console.log(err);
	 }
})
.redirectPath('/home/main');
everyauth.everymodule.handleLogout(routes.login.logout);
everyauth.everymodule.findUserById(function(user, callback){
	callback(user);
});


var app = express();
app.locals.appTitle = 'jsNode';

//mongoos 사용시 model 비교
app.use(function(req, res, next) {
	if (! models.User) return next(new Error("No models."))
	req.models = models;
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

//荑좏궎 �꽭�뀡 �꽕�젙 
app.use(cookieParser('3CCC4ACD-6ED1-4844-9217-82131BDCB239'));
app.use(session({secret: '2C4477FA-D649-4D44-9535-46E296EF984F'}));
app.use(everyauth.middleware());

app.use(function(req, res, next){
	if(req.session && req.session.admin) res.locals.admin = true;
	next();
});

//�꽭�뀡 沅뚰븳 �꽕�젙 
var auth_admin = function(req, res, next) {
	console.log(req.session);
	if(req.session && req.session.user && req.session.admin) return next();
	else return res.redirect('/login');
}

var auth_user = function(req, res, next) {
	if(req.session && req.session.user) return next();
	else return res.redirect('/login');
}

//�꽭�뀡 泥댄겕
var chkSession = function(req, res, next) {
	if(req.session) return next();
	else return res.redirect('/login');
} 


//development only
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

// Pages and routes
app.get('/', function(req, res) {
	res.redirect('login');
});

//화면 넘김
app.get('/admin', auth_admin, routes.admin.admin);
app.get('/admin/add', auth_admin, routes.admin.add);
app.get('/login', routes.login.login);
app.get('/logout', routes.login.logout);

//메인화면
app.get('/home/main', auth_user, routes.home.main);

// REST API routes
//�궗�슜�옄 �젙蹂� 議고쉶 
app.get('/api/authenticate/', routes.login.authenticate);
app.post('/api/addUser/', auth_admin, routes.user.add);

app.all('*', function(req, res) {
	res.send(404);
});


var server = http.createServer(app);
var io = require('socket.io').listen(server);
io.set('close timeout', 600);
io.set('heartbeat timeout', 600);
io.sockets.on('connection', function(socket){
	console.log(socket);
	socket.on('sendMessage', function(data){
		console.log(data);
		io.sockets.emit('receive', data);
	});
});

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
