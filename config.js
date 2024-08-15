const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  connectMongo: process.env.CONNECT_DB,
  port: process.env.PORT,
};
