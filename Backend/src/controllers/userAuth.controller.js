const User = require('../models/userAuth.model');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '7d' });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, shopName: user.shopName, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password, shopName } = req.body;

  try {
    const user = await User.signup(email, password, shopName);
    const token = createToken(user._id);

    res.status(200).json({ email: user.email, shopName: user.shopName, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { loginUser, signupUser, getProfile };
