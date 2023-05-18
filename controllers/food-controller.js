const bcrypt = require('bcrypt');
const axios = require('axios');
let dotenv = require('dotenv').config('../.env');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;
const RECSYS_URL = process.env.RECSYS_URL;




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
        const response = await axios.post(RECSYS_URL, JSON.stringify(recsApiInput), config);
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
    



    const getRecipeRecommendationForText = async (req, res) => {  
      //get recommendations based on user preferences from text inputs
    const preferences=JSON.stringify(req.body);
    console.log(preferences);

    const parsedPreferences = JSON.parse(preferences);
    const convertedPreferences = {};


    parsedPreferences.liked.forEach((item) => {
      convertedPreferences[item] = "liked";
    });

    parsedPreferences.disliked.forEach((item) => {
      convertedPreferences[item] = "disliked";
    });
    
    console.log(convertedPreferences);
    const recsApiInput = {
      "user": parsedPreferences.user,
      "quiz": convertedPreferences
    };
    console.log(recsApiInput);
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
  
    try {
      const response = await axios.post(RECSYS_URL, JSON.stringify(recsApiInput), config);
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


      const getRecipeRecommendationFromQuiz = async (req, res) => {  
        //get recommendations based on user preferences from quiz
        const preferences=req.body.quiz;
        
        console.log(preferences);
  
        const recsApiInput = {
          "user": preferences.user,
          "quiz": {}
        };
        preferences.ingr.forEach(item => {
          const { name, like } = item;
          recsApiInput.quiz[item.name] = item.like === "like" ? "liked" : "disliked";
        });

        console.log(JSON.stringify(recsApiInput));
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
      
        try {
          
          const response = await axios.post(RECSYS_URL, JSON.stringify(recsApiInput), config);
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
    getRecipeRecommendationForText,
    getRecipeRecommendationFromQuiz
   
};
