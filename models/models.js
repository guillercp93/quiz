var path = require('path');

//cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SqLite
var sequelize = new Sequelize(null, null, null, {dialect: 'sqlite', storage: 'quiz.sqlite'});

//importar la definicion de la tabla quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
//exportar definicion de tabla quiz
exports.Quiz = Quiz;

//crea e inicializa tabla de preguntas BD
sequelize.sync().success(function() {
	//se ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: "Capital de Italia?", respuesta: "Roma"}).success(function() {
				console.log('Base de datos inicializada');
			});
		}
	});
});