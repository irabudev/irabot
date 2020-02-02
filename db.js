// module.exports = {  url : "mongodb://irabu:irabu@cluster0-shard-00-00-ec04s.mongodb.net:27017,cluster0-shard-00-01-ec04s.mongodb.net:27017,cluster0-shard-00-02-ec04s.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority"};

require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection
  .on('open', () => {
    console.log('Mongoose connection open');
  })
  .on('error', (err) => {
    console.log(`Connection error: ${err.message}`);
  });

require('./models/chuck');
require('./models/bookmark');
