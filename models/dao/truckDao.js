const {
  Truck,
} = require('../truckModel');

module.exports.getTruck = async (options, callback = () => {}) => {
  const truck = await Truck.find(
      options, {
        __v: 0,
      },
      callback);

  if (!truck) {
    throw new Error(`No truck found.`);
  }

  if (truck.length === 1) {
    return truck[0];
  }

  return truck;
};
