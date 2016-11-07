

// index page
exports.list = function(req, res) {
	res.render('index', {
		title: 'TORC'
	})
	// Category
	// 	.findOne({name: 'Programming'})
	// 	// Credit: http://stackoverflow.com/a/18538054
	// 	.populate({path:'blogs', options: {sort: {'meta.createAt': -1}}})
	// 	.exec(function(err, category) {
	// 		if (err) {
	// 			console.log(err)
	// 		}

	// 		var blogs = category ? category.blogs : []
	// 		res.render('index', {
	// 			title: 'Blogs • Programming',
	// 			blogs: blogs,
	// 			categoryName: 'Programming',
	// 			md: md
	// 		})
	// 	})
}

// // blog detail page
// exports.detail = function(req, res) {
// 	var id = req.params.id

// 	Blog.update({_id: id}, {$inc: {pv: 1}}, function(err) {
// 		if (err) {
// 			console.log(err)
// 		}
// 	})
// 	Blog.findById(id, function(err, blog) {
// 		if (err) {
// 			console.log(err)
// 		}
// 		res.render('detail', {
// 			title: 'Blogs • Programming',
// 			blog: blog,
// 			categoryName: 'Programming',
// 			md: md,
// 			comments: []
// 		})
// 	})
// }