var Project = require('../models/project')
var Category = require('../models/category')
var Website = require('../models/website')
var Content = require('../models/content')

// angular partial templates
exports.partials = function(req, res) {
	var name = req.params.name
	res.render('partials/' + name)
}



exports.projectList = function(req, res) {

	//Credit: http://stackoverflow.com/a/34444634/4246348
	Project
	.find()
	.populate({
		path: 'websites',
		model: 'Website',
		populate: {
			path: 'contents',
			model: 'Content',
			populate: {
				path: 'categories',
				model: 'Category'
			}
		}
	})
	.exec(function(err, projects) {
		if (err) {
			console.log(err)
		}

		console.log(projects)
		return res.json(projects)
	})
}

// get categories and projects
exports.initInfo = function(req, res) {
	var infos = {}

	Project
	.find()
	.select('name')
	.exec(function(err, projects) {
		if (err) {
			console.log(err)
		}
		infos.projects = projects


		Category
		.find()
		.select('name')
		.exec(function(err, categories) {
			if (err) {
				console.log(err)
			}
			infos.categories = categories

			console.log(infos)
			return res.json(infos)
		})
	})
}

// new project
exports.saveProject = function(req, res) {
	var projectObj = {'name': req.body.name}
	var _project = new Project(projectObj)

	_project.save(function(err, project) {
		if (err) {
			console.log(err)
		}
		console.log(project)
		return res.end('success')
	})

}

exports.deleteProject = function(req, res) {

	Project.remove({_id: req.params.id}, function(err) {
		if (err) {
			console.log(err)
		}
		return res.end('success')
	})
}


// new website with new content, rating, ...
exports.saveWebsite = function(req, res) {
	var category_id = req.body.category_id
	var project_id = req.body.project_id
	var url = req.body.url
	var title = req.body.title
	var isPDF = req.body.isPDF

	Category
	.findById(category_id, function(err, category) {
		var _content = new Content({
			text: req.body.text,
			rating: req.body.rating,
			location: req.body.location
		})
		_content.categories.push(category._id)
		_content.save(function(err, content) {
			Website
			.findOne({url: url}, function(err, website) {
				if (err) {
					console.log(err)
				}
				if (!website) {
					website = new Website({
						url: url,
						title: title,
						isPDF: isPDF
					})
				}
				website.contents.push(content._id)
				website.save(function(err, _website) {
					Project.findOne({_id: project_id})
					.populate({
						path: 'websites',
						match: {_id: _website._id}
					})
					.exec(function(err, project) {
						if (err) {
							console.log(err)
						}
						// existing website
						if (project.websites.length) {
							return res.end('success')
						} else {
							project.websites.push(_website._id)
							project.save(function(err, project) {
								return res.end('success')
							})
						}
					})
				})
			})
		})
	})
}

exports.deleteWebsite = function(req, res) {

	Website.remove({_id: req.params.id}, function(err) {
		if (err) {
			console.log(err)
		}
		return res.end('success')
	})
}


// website project info
exports.websiteInfo = function(req, res) {
	var url = req.body.website

	Project
	.find()
	.populate({
		path: 'websites',
		match: {url: url}
	})
	.exec(function(err, projects) {
		if (err) {
			console.log(project)
		}

		var _projects = projects.filter(function(project) {
			return project.websites.length;
		})
		console.log(_projects)
		return res.json(_projects)
	})
}

exports.saveCategory = function(req, res) {
	var catObj = {'name': req.body.name}
	var _cat = new Category(catObj)

	console.log(req.body)
	_cat.save(function(err, cat) {
		if (err) {
			console.log(err)
		}
		console.log(cat)
		return res.end('success')		
	})
}
exports.setRating = function(req, res) {
	Content.findOneAndUpdate({_id: req.body._id}, req.body, {upsert: true}, function(err, content) {
		if (err) {
			return res.send(500, {error: err})
		}
		console.log(content)
		return res.end('success')
	})
}

// show all contents for a given website
exports.contentList = function(req, res) {
	Website
	.findOne({url: req.body.url})
	.populate({
		path: 'contents',
		Model: 'Content',
		populate: {
			path: 'categories',
			Model: 'Category'
		}
	})
	.exec(function(err, website) {
		if (err) {
			console.log(err)
			return res.send(500, {error: err})
		}
		var contents = website ? website.contents : []
		return res.json(contents)
	})
}

// // admin compose new blog
// exports.compose = function(req, res) {
// 	Category.fetch(function(err, categories) {
// 		res.render('admin-compose', {
// 			title: 'Add new blog',
// 			categories: categories,
// 			// tags: tags,
// 			blog: {}
// 		})
// 	})
// }

// // admin save blog (including new and update)
// exports.save = function(req, res) {
// 	// bodyParser extended = true -> is the key!!!, otherwise undefined
// 	var id = req.body.blog._id
// 	var blogObj = req.body.blog
// 	var _blog

// 	if (id) {  // update existing
// 		// TODO:
// 	} else {  // save new
// 		_blog = new Blog(blogObj)

// 		var categoryId = blogObj.category
// 		var categoryName = blogObj.categoryName

// 		_blog.save(function(err, blog) {
// 			if (err) {
// 				console.log(err)
// 			}

// 			if (categoryId) {  // select existing category
// 				Category.findById(categoryId, function(err, category) {
// 					category.blogs.push(blog._id)

// 					category.save(function(err, category) {
// 						redirectByCategory(category.name, blog._id, res)
// 					})
// 				})
// 			} else if (categoryName) {  // enter new categoryName
// 				var category = new Category({
// 					name: categoryName,
// 					blogs: [blog._id]
// 				})
// 				category.save(function(err, category) {
// 					blog.category = category._id
// 					blog.save(function(err, blog) {
// 						redirectByCategory(category.name, blog._id, res)
// 					})
// 				})
// 			} else {
// 				console.error('No category is entered or selected')
// 			}
// 		})

// 	}

// }


// function redirectByCategory(categoryName, blogId, res) {
// 	switch (categoryName) {
// 		case 'Programming':  // programming
// 			res.redirect('/programming/'+blogId)
// 			break;
// 		case 'Life':  // life
// 			res.redirect('/life/'+blogId)
// 			break;
// 		default:
// 			res.redirect('/')
// 			break
// 	}
// }