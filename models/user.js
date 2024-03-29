const cassandra = require('cassandra-driver');
const { v4: uuidv4 } = require('uuid');
let dotenv = require('dotenv').config('../.env');
const dataTypes = cassandra.types;

//create a connection to the cassandra database using ip address and port number
let cassandra_ip = process.env.cassandra_ip;
let cassandra_port = process.env.cassandra_port;
let contactPoints = [cassandra_ip + ':' + cassandra_port];
let localDataCenter = process.env.localDC;
let keyspace = process.env.cassandra_keyspace;
let username=process.env.cassandra_username;
let password=process.env.cassandra_password;

const client = new cassandra.Client({
  contactPoints: contactPoints,
  localDataCenter: localDataCenter,
  keyspace: keyspace,
  credentials: { username: username, password: password },
  queryOptions: { consistency: dataTypes.consistencies.localQuorum },
  socketOptions: { connectTimeout: 30000 }
});


/*
const secureConnectBundle = process.env.ASTRA_SECURE_BUNDLE_PATH;
const username = process.env.ASTRA_DB_USERNAME;
const password = process.env.ASTRA_DB_PASSWORD;
const keyspace = process.env.ASTRA_DB_KEYSPACE;


const client = new cassandra.Client({
  cloud: {
    secureConnectBundle: secureConnectBundle,
  },
  credentials: {
    username,
    password,
  },
  keyspace,
});*/

client.connect()
  .then(() => console.log('Connected to Cassandra database in user model'))
  .catch((err) => console.error(err));


const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM chef_keyspace.users WHERE email = ?';
  const result = await client.execute(query, [email], { prepare: true });
  return result.rows[0];
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
