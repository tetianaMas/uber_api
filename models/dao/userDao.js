const {User} = require('../userModel');

module.exports.getUser = async (email) => {
  const user = await User.findOne({
    email,
  });

  if (!user) {
    throw new Error(`No user found.`);
  }

  return user;
};
