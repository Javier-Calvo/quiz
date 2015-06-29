var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId){
	models.Comment.find({
		where: {
			id: Number(commentId)
		}
	}).then(function(comment) {
		if(comment){
			req.comment = comment;
			console.log("+++++ req.comment.texto"+req.comment.texto); // para depurar
			next();
		} else { 
			next(new Error ('No existe commentId=' + commentId ))}
		}
	).catch( function (error) { next( error )});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req, res){
	res.render('comments/new.ejs', {quizid: req.params.quizId, errors: []});
};

// POST /quizes/:quizId/comments
exports.create = function(req, res){
	var comment = models.Comment.build( 
		{ texto: req.body.comment.texto,
		  QuizId: req.params.quizId 
		});
	
	comment
	.validate()
	.then(
		function(err){
			if (err) {
				res.render('comments/new.ejs', {comment: comment, quizid: req.params.quizId, errors: errores});
			} else {
				comment // save: guarda en DB campo texto de comment
				.save()
				.then( function(){ res.redirect('/quizes/'+req.params.quizId)}) ;
			}  // res.redirect: Redirección HTTP a lista de preguntas
		}
	).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	console.log(req); // Me permite ver el select que ejecuta
	req.comment.publicado = true; // cambiando true por 1 obtengo el mismo error.
	
	req.comment.save( { fields: ["publicado"]})
		.then( function() { res.redirect('/quizes/'+req.params.quizId);})
		.catch( function(error){next(error)});
};
