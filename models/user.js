const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
let dotenv = require('dotenv').config('../.env');
const dataTypes = cassandra.types;


const secureConnectBundle = process.env.ASTRA_SECURE_BUNDLE_PATH;
const username = process.env.ASTRA_DB_USERNAME;
const password = process.env.ASTRA_DB_PASSWORD;
const keyspace = process.env.ASTRA_DB_KEYSPACE;


const client = new cassandra.Client({
  cloud: {
    secureConnectBundle,
  },
  credentials: {
    username,
    password,
  },
  keyspace,
});

client.connect()
  .then(() => console.log('Connected to Astra Cassandra database'))
  .catch((err) => console.error(err));

 
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  const result = await client.execute(query, [email], { prepare: true });
  return result.first();
};

const createUser = async (id, first_name,last_name, email, password) => {
  const query = 'INSERT INTO users (id, first_name,last_name, email, password) VALUES (?, ?, ?, ?,?)';
  const result = await client.execute(query, [id, first_name,last_name, email, password], { prepare: true });
  return result;
};



module.exports = {
  getUserByEmail,
  createUser,
};
