var path = require('path');

//postgres DATABASE_URL = postgres://user:pass@host:port/database
//SQLite DATABASE_URL = sqlite://:@:/

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/),
	DB_name = (url[6] || null),
	user = (url[2] || null),
	pwd = (url[3] || null),
	protocol = (url[1] || null),
	dialect = (url[1] || null),
	port = (url[5] || null),
	host = (url[4] || null),
	storage = process.env.DATABASE_STORAGE;

//cargar modelo ORM
var Sequelize = require('sequelize');

//Usar BBDD SqLite
var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect: protocol,
	protocol: protocol,
	port: port,
	host: host,
	storage: storage,	//solo SQLite (.env)
	omitNull: true		//solo Postgres
});
//var sequelize = new Sequelize(null, null, null, {dialect: 'sqlite', storage: 'quiz.sqlite'});

//importar la definicion de la tabla quiz
var quiz_path = path.join(__dirname, 'quiz');
var Quiz = sequelize.import(quiz_path);

//importar definicion de la tabla comentarios
var comment_path = path.join(__dirname, 'comment');
var Comment = sequelize.import(comment_path);

//asociaciones
Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

//exportar tablas
exports.Quiz = Quiz;
exports.Comment = Comment;

//crea e inicializa tabla de preguntas BD
sequelize.sync().success(function() {
	//se ejecuta el manejador una vez creada la tabla
	Quiz.count().success(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: "Capital de Italia?", respuesta: "Roma", tema:"Humanidades"});
			Quiz.create({pregunta: "Capital de Portugal?", respuesta: "Lisboa", tema:"Humanidades"}).success(function() {
				console.log('Base de datos inicializada');
			});
		}
	});
});