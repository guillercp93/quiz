var models = require('../models/models.js');

exports.show = function(req, res) {
	var datos = {
		nPreguntas: 0,
		nComentarios: 0,
		promedio: 0,
		preguntaS: 0,
		preguntaC: 0
	};

	models.Quiz.count().then(function(nQuiz) {
		datos.nPreguntas = nQuiz;
		return models.Comment.count({where: {publicado: true}});
	}).then(function(nCom) {
		datos.nComentarios = nCom;
		datos.promedio = datos.nComentarios/datos.nPreguntas;
		return models.Comment.count({distinct: 'QuizId', where: {publicado: true}});
	}).then(function(n) {
		datos.preguntaC = n;
		datos.preguntaS = datos.nPreguntas - datos.preguntaC;
		res.render('quizes/stadistics', {datos: datos, errors: []});
	}).catch(function (err) {
		next(err);
	});
}