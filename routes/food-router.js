const express = require('express');

const foodController = require('../controllers/food-controller');

const router = express.Router();

router.post('/create', foodController.createFood);
router.get('/:id', foodController.getFoodById);
router.post('/recommend', foodController.getRecipeRecommendation);
router.post('/recommendText', foodController.getRecipeRecommendationForText);
router.post('/recommendQuiz', foodController.getRecipeRecommendationFromQuiz);


module.exports = router;