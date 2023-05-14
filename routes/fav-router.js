const express = require('express');

const favController = require('../controllers/fav-controller');

const router = express.Router();

router.post('/createFavorite', favController.createNewFavorite);
router.get('/:UserId', favController.getFavoriteByUserId);
router.delete('/:UserId/:foodId', favController.deleteFavoriteByUserId);

module.exports = router;


