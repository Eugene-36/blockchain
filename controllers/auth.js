// const User = require('../db/userModel');
// const bcrypt = require('bcrypt');

// const registerUser = async (req, res) => {
//   try {
//     // Checking if email already exist
//     const existEmail = await User.findOne({ email: req.body.email });
//     if (existEmail) {
//       return res.status(400).json({ error: 'Email already exist' });
//     }
//     const hashPassword = await bcrypt.hash(req.body.password, 10);
//     const user = new User({
//       email: req.body.email,
//       password: hashPassword,
//     });
//     await user.save();
//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// module.exports = { registerUser };
