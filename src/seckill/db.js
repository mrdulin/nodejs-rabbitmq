const mongoose = require('mongoose');

const config = require('./config');

const { MONGODB } = config;

let uri;
if (MONGODB.USERNAME && MONGODB.PASSWORD) {
  uri = `mongodb://${MONGODB.USERNAME}:${MONGODB.PASSWORD}@${MONGODB.HOST}:${MONGODB.PORT}/${MONGODB.DBNAME}`;
} else {
  uri = `mongodb://${MONGODB.HOST}:${MONGODB.PORT}/${MONGODB.DBNAME}`;
}

mongoose.connect(uri);

mongoose.connection.on('connected', () => {
  console.log('Mongoose default connection open to ', uri);
});
mongoose.connection.on('disconnected', function() {
  console.log('Mongoose default connection disconnected');
});
mongoose.connection.on('error', err => {
  console.log('Mongoose default connection error: ' + err);
});

process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});
