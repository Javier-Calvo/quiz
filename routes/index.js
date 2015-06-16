var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz' });
});

router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);
// Ruta para la página de créditos
router.get('/author', function(req, res) {
  res.render('author', {autor: 'Javier Calvo'});
});

module.exports = router;
