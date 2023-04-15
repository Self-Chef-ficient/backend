require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');

const {authenticate } = require('./middleware/auth-middleware');
const authController = require('./controllers/auth-controller');
const authRouter = require('./routes/auth-router');




const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// enable cors
//create a whitelist of allowed domains for cors
const corsWhitelist=['https://www.google.com','127.0.0.1:3000','http://localhost:3000']
//create a cors options object
const corsOptions={
  origin: function(origin,callback){
    if(corsWhitelist.indexOf(origin)!==-1 || !origin){
      callback(null,true)
    }else{
      callback(new Error('Not allowed by CORS'))
    }
  }
}
app.use(cors(corsOptions));


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false,
}));


app.post('/register', authController.register);
app.post('/login', authController.login);
app.get('/logout', authController.logout);

app.get('/home', authenticate, (req, res) => {
  console.log(req.session);
  console.log(req.body)
  res.status(200).send(`Welcome home \n You are logged in as now in protected path`);
});
// Route
app.use('/auth', authRouter);

// Empty path route
app.get('/', (req, res) => {
  res.send('Welcome to the home page');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
