const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./db/userModel');
const auth = require('./auth');
const express = require('express');
const app = express();
const { port } = require('./config');

const connection = require('./db/connect');
connection();
// Handle corse issue
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});
//Need to parse body
app.use(express.json());
// config file where all env variables
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/next', (req, res) => {
  res.send('Work');
});
// Register Endpoint
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
// Login Endpoint
app.post('/login', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      bcrypt
        .compare(req.body.password, user.password)
        .then((passwordCheck) => {
          if (!passwordCheck) {
            return res.status(404).send({
              message: 'Passwords does not match',
              error,
            });
          }

          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            'RANDOM-TOKEN',
            { expiresIn: '24h' }
          );
          res.status(200).send({
            message: 'Login Successful',
            email: user.email,
            token,
          });
        })
        .catch((e) => {
          res.status(404).send({ message: 'Password does not match' });
        });
    })
    .catch((e) => {
      res.status(404).send({ message: 'Email not found' });
    });
});

// free endpoint
app.get('/free-endpoint', (req, res) => {
  res.json({ message: 'You are free to access me anytime' });
});
// authentication endpoint
app.get('/auth-endpoint', auth, (req, res) => {
  res.json({ message: 'You are authorized to access me' });
});
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
