//GET /login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors})
}

//POST /login
exports.create = function(req, res) {
	var login = req.body.login,
		password = req.body.password,
		userController = require('./user_controller.js');

	userController.autenticar(login, password, function(error, user) {
		if (error) {
			req.session.errors = [{"message": "Se ha producido un error. "+error}];
			res.redirect('/login');
			return;
		}

		//crear req.session.user y guardar campos id y username
		//la sesion se define por la existencia de
		req.session.user = {id: user.id, username: user.username};
		res.redirect('/'); //redireccion a path anterior a login
	});
}

// DELETE /logout
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect('/');
}

//mw de autorizacion de acceso HTTP restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	}else{
		res.redirect('/login');
	}
}