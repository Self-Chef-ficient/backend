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
});
*/
client.connect()
  .then(() => console.log('Connected to Cassandra database in food model'))
  .catch((err) => console.error(err));

const createNewFood = async (id, name, description, image) => {
  const query = 'INSERT INTO food (food_id, food_name, instructions, image_link) VALUES (?, ?, ?, ?)';
  const result = await client.execute(query, [id, name, description, image], { prepare: true });
  return result;
}
const getFoodById = async (id) => {
  const query = 'SELECT * FROM food WHERE food_id = ?';
  const result = await client.execute(query, [id], { prepare: true });
  return result.rows[0];
}



//console.log(createNewIngr("00003a70b1","Crunchy Onion Potato Bake","Step 0->Preheat oven to 350 degrees Fahrenheit. Step 1->Spray pan with non stick cooking spray. Step 2->Heat milk, water and butter to boiling; stir in contents of both pouches of potatoes; let stand one minute. Step 3->Stir in corn. Step 4->Spoon half the potato mixture in pan. Step 5->Sprinkle half each of cheese and onions; top with remaining potatoes. Step 6->Sprinkle with remaining cheese and onions. Step 7->Bake 10 to 15 minutes until cheese is melted. Step 8->Enjoy ! ","http://img.sndimg.com/food/image/upload/w_512,h_512,c_fit,fl_progressive,q_95/v1/img/recipes/47/91/49/picaYYmb9.jpg"))

module.exports = {
  createNewFood,
  getFoodById
};
