var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);       // autoload :quizId
router.param('commentId', commentController.load); // autoload :commentId  

// Definición de rutas de sesión
router.get('/login', sessionController.new); 		// formularioo login
router.post('/login', sessionController.create); 	// crear sesión
router.get('/logout', sessionController.destroy);	// destruir sesión

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new',                  sessionController.loginRequired, quizController.new);
router.post('/quizes/create',              sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit',   sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)',        sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)',     sessionController.loginRequired, quizController.destroy);

// Definción de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments',    commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish',
				sessionController.loginRequired, commentController.publish);
// router.get('/quizes/:quizId(\\d+)/comments/edit/:posicion(\\d+)',    	commentController.edit);
// router.put('/quizes/:quizId(\\d+)/comments/:posicion(\\d+)',        	commentController.update);
// router.delete('/quizes/:quizId(\\d+)/comments/:posicion(\\d+)',         commentController.destroy);

// router.get('/quizes/question', quizController.question);
// router.get('/quizes/answer', quizController.answer);

// Ruta para la página de créditos
router.get('/author', function(req, res) {
  res.render('author', {autor: 'Javier Calvo', errors: []}); 
  // Causa del error al pulsar Créditos: faltaba poner errors: [] aquí.
});

module.exports = router;
