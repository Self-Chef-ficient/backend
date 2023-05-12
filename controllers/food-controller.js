const bcrypt = require('bcrypt');
const axios = require('axios');
let dotenv = require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;


const { v4: uuidv4 } = require('uuid');
const foodService = require('../services/food-service');

const createFood = async (req, res) => {
    try {
        
        const { id,name, description, image } = req.body;
        console.log(req.body);
        await foodService.createNewFood(id, name, description, image);
        res.status(201).send(`Food ${name} created`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
    };

const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await foodService.getFoodById(id);
        res.status(200).json(result);
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);

    }
}

const getRecipeRecommendation = async (req, res) => {  
    let count=0,liked=0,disliked = 0;
    for (let key in req.body.quiz) {
        if (req.body.quiz[key] === 'liked') {
            count++;
            liked++;
        }
        else if (req.body.quiz[key] === 'disliked') {
            count++;
            disliked++;
        }
    }
    console.log(`You have ${count} ingridients, ${liked} liked and ${disliked} disliked`);
    
    //get the user id of logged in user from the jwt token in session
    
    const recsApiInput = {
        user: 'f1393d83-fef8-439a-8fb3-3fb018632fb0',
        quiz: req.body.quiz
      };
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
    
      try {
        const response = await axios.post('http://34.127.17.81/getRecs', JSON.stringify(recsApiInput), config);
        const recipieIdList = response.data.recommendations;
        console.log("inside:", recipieIdList);
        
        const recommendationArray = [];
        for (let i = 0; i < recipieIdList.length; i++) {
          const result = await foodService.getFoodById(recipieIdList[i]);
          if (result != null) {
            recommendationArray.push(result);
          }
        }
        
        console.log(recommendationArray);
        res.json({ recommendations: recommendationArray });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
      }
    };
    





module.exports = {
    createFood,
    getFoodById,
    getRecipeRecommendation,
    
};