module.exports.checkShipper = (req, res, next) => {
  if (req.user.role.toLowerCase() !== 'shipper') {
    return res.status(400).json({
      message: 'You do not have permission for this operation!',
    });
  }

  next();
};
