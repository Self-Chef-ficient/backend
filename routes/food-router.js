const express = require('express');

const foodController = require('../controllers/food-controller');

const router = express.Router();

router.post('/create', foodController.createFood);
router.get('/:id', foodController.getFoodById);
router.post('/recommend', foodController.getRecipeRecommendation);
router.post('/recommend2', foodController.getRecipeRecommendation2);
router.post('/recommend3', foodController.getRecipeRecommendation3);


module.exports = router;