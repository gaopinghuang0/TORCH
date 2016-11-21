// TODO: use more advanced auth later
var auth = require('basic-auth')


// middleware for user
exports.signinRequired = function(req, res, next) {
    var user = req.session.user;
    var credentials = auth(req);

    if (!user) {
        if (!credentials || credentials.name !== 'hgp' || credentials.pass !== 'test') {
            res.statusCode = 401
            res.setHeader('WWW-Authenticate', 'Basic realm="example"')
            res.end('Access denied')
        } else {
            req.session.user = {name: 'hgp', pass: 'test'}
        }
    }

    next();
}
