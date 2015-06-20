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

//// He instalado la última versión (3.2.0) de sequelize, por lo que el interfaz ha 
// cambiado para usar "Promesas". Básicamente hay que cambiar .success por .then,
// .error por .catch y .done por .finally.

// sequelize.sync() crea e inicializa tabla de preguntas en DB
// 1.7.0 sequelize.sync().success(function() {
sequelize.sync().then(function() {
// success(...) -> then (...) ejecuta el manejador una vez creada la tabla
  // 1.7.0 Quiz.count().success(function (count){
  Quiz.count().then(function (count){
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta:  'Capital de Italia',
      	            respuesta: 'Roma'
      	         })
      // 1.7.0 .success(function(){console.log('Base de datos inicializada')});
      .then(function(){console.log('Base de datos inicializada')});
    };
  });
});