var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Usar BBDD SQLite:
//var sequelize = new Sequelize(null, null, null, 
//                       {dialect: "sqlite", storage: "quiz.sqlite"}
//                    );

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