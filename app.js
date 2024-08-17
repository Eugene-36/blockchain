const bcrypt = require('bcrypt');
const User = require('./db/userModel');
const express = require('express');
const app = express();
const { port } = require('./config');

const connection = require('./db/connect');
connection();

//Need to parse body
app.use(express.json());
// config file where all env variables
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/next', (req, res) => {
  res.send('Work');
});

app.post('/register', (req, res) => {
  console.log('BODY', req.body);

  bcrypt
    .hash(req.body.password, 10)
    .then((hashedPassword) => {
      const user = new User({
        email: req.body.email,
        password: hashedPassword,
      });
      user
        .save()
        .then((result) => {
          res.status(201).send({
            message: 'User Created Successfully',
            result,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: 'Error creating user',
            error,
          });
        });
    })
    .catch((e) => {
      res.status(500).send({
        message: 'Password was not hashed successfully',
        e,
      });
    });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
