const jwt = require('jsonwebtoken');
const {User} = require('../../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET;

module.exports.auth = async (req, res, next) => {
  const header = req.headers['authorization'];

  if (!header) {
    return res.status(401).json({
      message: 'No auth http header found',
    });
  }

  const [tokenType, token] = header.split(' ');

  if (!tokenType || !token) {
    return res.status(400).json({
      message: 'No JWT token found',
    });
  }

  const verifiedUserToken = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(verifiedUserToken._id);

  if (!user) {
    return res.status(400).json({
      message: 'No user found!',
    });
  }
  req.user = user;
  next();
};
