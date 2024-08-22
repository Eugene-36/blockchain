const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./db/userModel');
const auth = require('./auth');
// const { registerUser } = require('./controllers/auth');

const express = require('express');
const app = express();
const { port } = require('./config');

const connection = require('./db/connect');
// routers
const authRouter = require('./routes/auth');
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
app.use('/register', (req, res) => {
  const registerUser = async () => {
    try {
      // Checking if email already exist
      const existEmail = await User.findOne({ email: req.body.email });
      if (existEmail) {
        return res.status(400).json({ error: 'Email already exist' });
      }
      const hashPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        email: req.body.email,
        password: hashPassword,
      });
      await user.save();
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  registerUser();
});
// Login Endpoint
app.post('/login', (req, res) => {
  // =======
  const loginUser = async () => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json('Please provide your email and password');
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json('Such user did not found');
    }

    const bcryptPassword = await bcrypt.compare(password, user.password);
    if (!bcryptPassword) {
      return res.status(401).json('Invalid Credential');
    }
    if (bcryptPassword) {
      const token = jwt.sign(
        {
          userId: user._id,
          userEmail: user.email,
        },
        'RANDOM-TOKEN',
        { expiresIn: '24h' }
      );

      return res.status(200).send({
        message: 'Login Successful',
        email: user.email,
        token,
      });
    }
  };
  loginUser();
});

// free endpoint
app.get('/free-endpoint', (req, res) => {
  res.json({ message: 'You are free to access me anytime' });
});
// authentication endpoint
app.get('/auth-endpoint', auth, (req, res) => {
  res.json({ message: 'You are authorized to access me' });
});
const start = async () => {
  try {
    await connection();
    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
