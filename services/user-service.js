const { response } = require('express');
const userModel = require('../models/user');

const getUserByEmail = async (email) => {
  const user = await userModel.getUserByEmail(email);
  
  return user;
};

const createUser = async (id, first_name,last_name, email, password) => {
  try {

  
  const user=await userModel.createUser(id, first_name,last_name, email, password);

}
catch (err) {
  console.log(err);
  response.status(500).send(err.message);
}
};

module.exports = {
  getUserByEmail,
  createUser,
};
