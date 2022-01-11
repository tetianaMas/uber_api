const {User} = require('../models/userModel');
const bcrypt = require('bcrypt');

module.exports.getUserInfo = async (req, res) => {
  const user = req.user;

  return res.status(200).json({
    user: {
      _id: user._id,
      email: user.email,
      created_date: user.createdDate,
    },
  });
};

module.exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.user._id);
  return res.status(200).json({
    message: 'Profile deleted successfully',
  });
};

module.exports.changePassword = async (req, res) => {
  const newPassword = req.body.newPassword;

  await User.findByIdAndUpdate(req.user._id, {
    $set: {
      password: await bcrypt.hash(newPassword, 10),
    },
  });

  return res.status(200).json({
    message: 'Password changed successfully',
  });
};
