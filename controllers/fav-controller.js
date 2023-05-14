const bcrypt = require('bcrypt');
const axios = require('axios');
let dotenv = require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;



const { v4: uuidv4 } = require('uuid');
const favModel = require('../models/fav-model');

const createNewFavorite = async (req, res) => {
    try {
        const { UserId,food_id,food_name,food_link,food_method } = req.body;
        await favModel.createNewFavorite(UserId,food_id,food_name,food_link,food_method);
        res.status(201).send(`Favorite ${food_name} created`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    }

const getFavoriteByUserId = async (req, res) => {
    try {
        const { UserId } = req.params;
        const result = await favModel.getFavoriteByUserId(UserId);
        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    }

const deleteFavoriteByUserId = async (req, res) => {
    try {
        const { UserId,foodId } = req.params;
        await favModel.deleteFavoriteByUserId(UserId,foodId);
        res.status(200).send(`Favorite ${foodId} deleted`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    }

module.exports = { createNewFavorite, getFavoriteByUserId, deleteFavoriteByUserId };
