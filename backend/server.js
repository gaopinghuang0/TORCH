var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var mongoStore = require('connect-mongo')(session)
var logger = require('morgan')
var path = require('path')
var mongoose = require('mongoose')
var config = require('./config/config')

var port = process.env.PORT || config.PORT
var dbUrl = 'mongodb://localhost/collect'
var app = express()

mongoose.connect(dbUrl)

app.set('views', './server/views/pages')
app.set('view engine', 'jade')

// use body-parser to grab info from POST
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
	secret: 'blog',
	// use mongo to store session permanently
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions'
	}),
	resave: false,
	saveUninitialized: true
}))

var env = process.env.NODE_ENV || 'development'
app.locals.node_env = env
if (env === 'development') {
	app.set('showStackError', true)
	app.use(logger(':method :url :status'))
	// prettify the page source
	app.locals.pretty = true
	mongoose.set('debug', true)
}

// all routes
require('./server/routes')(app)

app.locals.moment = require('moment')
app.listen(port)

console.log('server started on port ' + port)