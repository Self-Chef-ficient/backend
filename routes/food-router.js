const express = require('express');

const foodController = require('../controllers/food-controller');

const router = express.Router();

router.post('/create', foodController.createFood);
router.get('/:id', foodController.getFoodById);
router.post('/recommend', foodController.getRecipeRecommendation);


module.exports = router;