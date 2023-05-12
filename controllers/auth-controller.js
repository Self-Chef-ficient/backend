const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = process.env.JWT_SECRET;



const { v4: uuidv4 } = require('uuid');
const userService = require('../services/user-service');

const register = async (req, res) => {
  try {
    const id = uuidv4();
    const { first_name,last_name, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    //check if user exists
    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      console.log('User already exists');
      res.status(400).send('User already exists');
    }
    else{
    await userService.createUser(id, first_name,last_name, email, hashedPassword);
    res.status(201).send(`User ${first_name} - ${last_name} registered`);
  }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await userService.getUserByEmail(email);
    if (!user) {
      res.status(401).send('Invalid email or password');
    } else {
      console.log(user);
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign(
          { id:user.id, email: email },
             secret, 
             
             { expiresIn: '1h' });



        res.status(200).send({ token: token, email: email, first_name: user.first_name, last_name: user.last_name, id: user.id});


      } else {
        res.status(401).send('Invalid email or password');
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const logout = async (req, res) => {
  try {
    console.log("trying to logout user: ", req.session.first_name);
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {

        res.status(200).send('User Logged out');
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  register,
  login,
  logout,
};
