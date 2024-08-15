const express = require('express');
const app = express();
// const port = 3000;
const { port } = require('./config');

const connection = require('./db/connect');
connection();
// config file where all env variables

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/next', (req, res) => {
  res.send('Normal NORMAL NORMAL NORMAL');
});
// app.post('/submit-form', (req, res) => {
//   res.send('Form submitted');
// });
app.use((req, res, next) => {
  console.log(`${req.method} request for ${req.url}`);
  next();
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
