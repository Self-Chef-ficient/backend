const foodModel = require('../models/food');

const createNewFood = async (id, name, price, description, image) => {
    try {
    const food = await foodModel.createNewFood(id, name, price, description, image);
    return food;
    }
    catch (err) {
        console.log(err);
        res.status(500).json(err);

    }
};


const getFoodById = async (id) => {
    try{
    const food = await foodModel.getFoodById(id);
    return food;
}

catch (err) {
    console.log(err);
    res.status(500).json(err);

}
};


module.exports = {
    createNewFood,
    getFoodById,
};


    