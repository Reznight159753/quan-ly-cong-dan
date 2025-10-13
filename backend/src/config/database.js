const cassandra = require('cassandra-driver');
require('dotenv').config();

const authProvider = new cassandra.auth.PlainTextAuthProvider(
  process.env.CASSANDRA_USERNAME,
  process.env.CASSANDRA_PASSWORD
);

const client = new cassandra.Client({
  contactPoints: [process.env.CASSANDRA_CONTACT_POINTS],
  localDataCenter: process.env.CASSANDRA_DATACENTER,
  keyspace: process.env.CASSANDRA_KEYSPACE,
  authProvider: authProvider,
  protocolOptions: { port: parseInt(process.env.CASSANDRA_PORT) }
});

client.connect()
  .then(() => console.log('Connected to Cassandra'))
  .catch(err => console.error('Error connecting to Cassandra:', err));

module.exports = client;