// server.js
const dotenv = require('dotenv');
dotenv.config();
// console.log(`Your port is ${process.env.CONNECT_DB}`); // 8626

module.exports = {
  connectMongo: process.env.CONNECT_DB,
  port: process.env.PORT,
};
