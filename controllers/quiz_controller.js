var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find({	// find -> findById -> find
	    where: { id: Number(quizId) },
		include: [{ model: models.Comment }]
	}).then (function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else{next(new Error('No existe quizId=' + quizId));}  // Ojo al ;
    }
  ).catch(function(error){next(error);});
};

// GET /quizes
exports.index = function(req, res) {
// ->	models.Quiz.findAll().then(function(quizes) {
// ->		res.render('quizes/index.ejs', { quizes: quizes});
	var condicion=req.query.search || '%';
	if (condicion!='%') condicion='%'+condicion.replace(/\s/g, '%')+'%';
	
	models.Quiz.findAll({where: ["pregunta like ?", condicion]}).then(
	  function(quizes){
		res.render('quizes/index',{quizes: quizes, errors: []});
	}
   ).catch(function(error){next(error)});
};
  
// GET /quizes/:id
exports.show = function(req, res) {
	// The argument passed to findOne must be an options object, use findById 
	// if you wish to pass a single primary key value
	// Cambio find por findById.  Funciona una vez rearrancado el servidor
	// models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: req.quiz, errors: []});
	//})
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	var resultado = 'Incorrecto'
	// models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		} 
		res.render('quizes/answer', { quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res){
	var quiz = models.Quiz.build(// crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res){
	var quiz = models.Quiz.build( req.body.quiz );

/****************** No funciona (visto en el foro) ******************
		var errors = quiz.validate();  // errors no tiene método then
	if (errors)
	{
		var i=0; var errores=new Array();
		for (var prop in errors) errores[i++]={message: errors[prop]};		
		res.render('quizes/new', {quiz: quiz, errors: errores});
	} else {
		quiz // save: guarda en DB campos pregunta y respuesta de quiz
		.save({fields: ["pregunta", "respuesta"]})
		.then( function(){ res.redirect('/quizes')}) ; // res.redirect: Redirección HTTP a lista de preguntas
	}
*******************************************************************/
	quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz // save: guarda en DB campos pregunta y respuesta de quiz
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then( function(){ res.redirect('/quizes')})
			}  
		}
	);
};

// GET /quizes/:id/edit
exports.edit = function(req, res){
	var quiz = req.quiz; // autoload de instancia quiz
		
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res){
	req.quiz.pregunta   = req.body.quiz.pregunta;
	req.quiz.respuesta  = req.body.quiz.respuesta;
	req.quiz.tema       = req.body.quiz.tema;
	
	req.quiz
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: errores});
			} else {
				req.quiz // save: guarda campos pregunta y respuesta en DB 
				.save({fields: ["pregunta", "respuesta", "tema"]})
				.then( function(){ res.redirect('/quizes')}) ;
			}	
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res){
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch( function(error){ next(error)});
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
