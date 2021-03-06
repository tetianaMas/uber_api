module.exports.async = (callback) => {
  return (req, res, next) => {
    callback(req, res, next)
        .catch(next);
  };
};
