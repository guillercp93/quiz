var express = require('express'),
	router = express.Router(),
	quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {title: 'Quiz'});
});

//Autoload de comando con :quizId
router.param('quizId', quizController.load);	//autoload :quizId

/*pagina de quizes. */
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/author', quizController.author);

module.exports = router;
