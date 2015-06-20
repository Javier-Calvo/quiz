var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite:
var sequelize = new Sequelize(null, null, null, 
                       {dialect: "sqlite", storage: "quiz.sqlite"}
                    );

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));

exports.Quiz = Quiz; // exportar definición de tabla Quiz

/* 
// Parece que a partir de la versión 1.7.0 (usada en el curso) Sequelize Promises (Promesas)
// reemplaza EventEmitter.
// https://github.com/sequelize/sequelize/wiki/Upgrading-to-2.0
// Cambios fundamentales: .success -> .then, .done -> .finally y .error -> .catch
*/

// sequelize.sync() crea e inicializa tabla de preguntas en DB
// 1.7.0 sequelize.sync().success(function() {
// success(...) ejecuta el manejador una vez creada la tabla
sequelize.sync().then(function() {
  // 1.7.0 Quiz.count().success(function (count){
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa sólo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',

      	            respuesta: 'Roma'
      	         })
      // 1.7.0 .success(function(){console.log('Base de datos inicializada')});
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});