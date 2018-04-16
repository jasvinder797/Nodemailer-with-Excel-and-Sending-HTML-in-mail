var express = require('express'),
 path = require('path'),
 bodyParser = require('body-parser'),
 routes = require('./routes/web'), //web routes
 apiRoutes = require('./routes/api'); //api routes
var cors = require('cors');
var app = express();
app.use(cors());
// parse application/json 
app.use(bodyParser.json());
// setting static files location './app' for angular app html and js
app.use(express.static(path.join(__dirname, 'static')));	
// setting static files location './node_modules' for libs like angular, bootstrap
app.use(express.static('node_modules'));
// configure our routes
app.use('/', routes);
app.use('/sendmail', apiRoutes);

// setting port number for running server
var port = process.env.PORT || 8000;




// starting express server
app.listen(port, function() {
 console.log("Server is running at : http://localhost:" + port);
});
