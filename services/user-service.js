const userModel = require('../models/user');

const getUserByEmail = async (email) => {
  const user = await userModel.getUserByEmail(email);
  
  return user;
};

const createUser = async (id, first_name,last_name, email, password) => {
  await userModel.createUser(id, first_name,last_name, email, password);
};

module.exports = {
  getUserByEmail,
  createUser,
};
