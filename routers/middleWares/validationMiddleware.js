const joi = require('joi');

module.exports.validateRegistr = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string()
        .required(),
    password: joi.string()
        .required(),
    role: joi.string()
        .required(),
  });

  await schema.validateAsync(req.body);
  next();
};

module.exports.validateLogin = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string()
        .required(),
    password: joi.string()
        .required(),
  });

  await schema.validateAsync(req.body);
  next();
};

module.exports.load = async (req, res, next) => {
  const schema = joi.object({
    name: joi.string()
        .required(),
    payload: joi.number()
        .required(),
    pickup_address: joi.string()
        .required(),
    delivery_address: joi.string()
        .required(),
    dimensions: {
      width: joi.number()
          .required(),
      length: joi.number()
          .required(),
      height: joi.number()
          .required(),
    },
  });

  await schema.validateAsync(req.body);
  next();
};

module.exports.truck = async (req, res, next) => {
  const schema = joi.object({
    type: joi.string()
        .required(),
  });

  await schema.validateAsync(req.body);
  next();
};

module.exports.id = async (req, res, next) => {
  const schema = joi.object({
    id: joi.string()
        .required(),
  });

  await schema.validateAsync(req.params);
  next();
};

module.exports.password = async (req, res, next) => {
  const schema = joi.object({
    oldPassword: joi.string()
        .required(),
    newPassword: joi.string()
        .required(),
  });

  await schema.validateAsync(req.body);
  next();
};

module.exports.email = async (req, res, next) => {
  const schema = joi.object({
    email: joi.string()
        .required(),
  });

  await schema.validateAsync(req.body);
  next();
};
