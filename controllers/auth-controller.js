const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const saltRounds = 10;
const secret = 'mysecret';

const { v4: uuidv4 } = require('uuid');
const userService = require('../services/user-service');

const register = async (req, res) => {
  try {
    const id = uuidv4();
    const { first_name,last_name, email, password } = req.body;
    console.log(req.body);
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await userService.createUser(id, first_name,last_name, email, hashedPassword);
    req.session.userId = id;
    req.session.first_name = first_name;
    req.session.last_name = last_name;
    res.status(201).send(`User ${first_name} - ${last_name} registered`);
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
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        const token = jwt.sign({ email: email }, secret, { expiresIn: '1h' });
        req.session.userId = user.id;
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;
        req.session.token = token;


        res.status(200).send(`Welcome ${user.first_name} ${user.last_name}! \n You are logged in as ${user.email}`);
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
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        res.status(200).send('Logged out');
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
