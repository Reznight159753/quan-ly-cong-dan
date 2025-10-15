const cassandra = require('cassandra-driver');
require('dotenv').config();

const client = new cassandra.Client({
  contactPoints: [process.env.DB_CONTACT_POINTS || '127.0.0.1'],
  localDataCenter: process.env.DB_LOCAL_DATA_CENTER || 'datacenter1',
  keyspace: process.env.DB_KEYSPACE || 'quan_ly_cong_dan',
});

client.connect(err => {
  if (err) {
    console.error('Lỗi kết nối Cassandra:', err);
  } else {
    console.log('Đã kết nối thành công đến Cassandra.');
  }
});

module.exports = { client };