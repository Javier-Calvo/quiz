var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then (function(quiz) {  // find -> findById
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId));}
    }
  ).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', { quizes: quizes});
	}
   ).catch(function(error){next(error)});
};
  
// GET /quizes/:id
exports.show = function(req, res) {
	// The argument passed to findOne must be an options object, use findById 
	// if you wish to pass a single primary key value
	// Cambio find por findById.  Funciona una vez rearrancado el servidor
	// models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz});
	//})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto'
	// models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		} 
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado});
};

/******************************************************************

// GET /quizes/question
exports.question = function(req, res) {
  models.Quiz.findAll().then(function(quiz) {
    res.render('quizes/question', { pregunta: quiz[0].pregunta});
  })
};

// GET /quizes/answer
exports.answer = function(req, res) {
  models.Quiz.findAll().then(function(quiz) {
    if (req.query.respuesta === quiz[0].respuesta) {
      res.render('quizes/answer', { respuesta: 'Correcto' });
    } else {
      res.render('quizes/answer', { respuesta: 'Incorrecto'});
    }
  })
};
*******************************************************************/
