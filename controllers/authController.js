const mongoose = require('mongoose');
const {User} = require('../models/userModel');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const bcrypt = require('bcrypt');
const userDao = require('../models/dao/userDao');

module.exports.registr = async (req, res) => {
  const {
    email,
    password,
    role,
  } = req.body;

  const user = new User({
    _id: new mongoose.Types.ObjectId(),
    email,
    password: await bcrypt.hash(password, 10),
    role,
  });

  await user.save();

  return res.status(200).json({
    message: 'Profile created successfully',
  });
};

module.exports.login = async (req, res) => {
  const {
    email,
    password,
  } = req.body;

  const user = await userDao.getUser(email);

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({
      message: `Wrong password.`,
    });
  }

  const token = jwt.sign({
    username: user.username,
    _id: user._id,
    role: user.role,
  }, JWT_SECRET);

  return res.status(200).json({
    jwt_token: token,
  });
};

module.exports.resetPassword = async (req, res) => {
  const user = await User.findById({
    _id: req.user._id,
  });

  if (user) {
    return res.status(200).json({
      message: 'New password sent to your email address',
    });
  }
};
