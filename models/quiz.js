module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Quiz', {
		pregunta: {
			type: DataTypes.STRING,
			validate: {noEmpty: {msg: "-> falta pregunta"}}
		},
		respuesta: {
			type: DataTypes.STRING,
			validate: {noEmpty: {msg: "-> falta respuesta"}}
		}
	});
}