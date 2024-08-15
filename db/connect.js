const mongoose = require('mongoose');
const { connectMongo } = require('../config');

const connectDB = async (url) => {
  try {
    await mongoose.connect(connectMongo).then(console.log('MongoDB connected'));
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = connectDB;
