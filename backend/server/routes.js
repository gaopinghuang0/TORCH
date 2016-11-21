// get all controllers
var Index = require('./controllers/index')
var API = require('./controllers/api')
var User = require('./controllers/user')


module.exports = function(app) {

	// pre-handle user, so that every page can check session
	app.use(function(req, res, next) {
		var _user = req.session.user

		app.locals.user = _user

		next()
	})

	// Index
	app.get('/', User.signinRequired, Index.list)
	app.get('/home', User.signinRequired, Index.list)

	// For Angular partial templates
	app.get('/partials/:name', API.partials)

	// Api
	app.get('/api/project/list', API.projectList)
	app.get('/api/init/info', API.initInfo)
	app.post('/api/project/save', API.saveProject)
	app.delete('/api/project/:id', API.deleteProject)
	app.post('/api/category/save', API.saveCategory)
	app.post('/api/website/info', API.websiteInfo)
	app.post('/api/website/save', API.saveWebsite)
	app.delete('/api/website/:id', API.deleteWebsite)
	app.post('/api/content/rating', API.setRating)
	app.post('/api/content/list', API.contentList)
	// app.get('/api/popular-blog/:categoryName', API.popularList)

	// Category

	// Search Results


	// // User
	// app.post('/user/signin', User.signin)
	// // app.post('/user/signup', User.signup)
	// app.get('/signin', User.showSignin)

}