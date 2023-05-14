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

client.connect()
  .then(() => console.log('Connected to Cassandra database in favorite model'))
  .catch((err) => console.error(err));

const createNewFavorite = async (UserId,foodId,food_name,food_link,food_method) => {
    const query = 'INSERT INTO chef_keyspace.fav_food (UserId, food_id, food_name, food_link, food_method) VALUES (?, ?, ?, ?, ?)';
    const result = await client.execute(query, [UserId,foodId,food_name,food_link,food_method], { prepare: true });
    return result;
    }
const getFavoriteByUserId = async (UserId) => {
    const query = 'SELECT * FROM chef_keyspace.fav_food WHERE UserId = ?';
    const result = await client.execute(query, [UserId], { prepare: true });
    return result.rows;
    }

const deleteFavoriteByUserId = async (userId,foodId) => {
    const query = 'DELETE FROM chef_keyspace.fav_food WHERE UserId = ? AND food_id = ?';
    const result = await client.execute(query, [userId,foodId], { prepare: true });
    return result;
    }

module.exports = { createNewFavorite, getFavoriteByUserId, deleteFavoriteByUserId };

