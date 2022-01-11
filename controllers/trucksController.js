const {Truck} = require('../models/truckModel');
const truckDao = require('../models/dao/truckDao');

module.exports.getTrucks = async (req, res) => {
  const user = req.user;

  Truck.find({
    created_by: user._id,
  }, {
    __v: 0,
  } )
      .populate({
        path: 'trucks',
      })
      .exec((err, trucks) => {
        if (err) {
          throw err;
        }
        return res.status(200).json({
          trucks,
        });
      });
};

module.exports.addTruck = async (req, res) => {
  const user = req.user;

  await user.save(async (err) => {
    if (err) {
      throw err;
    }

    try {
      const truck = new Truck({
        type: req.body.type,
        created_by: user._id,
      });

      await truck.save();

      return res.status(200).json({
        message: 'Truck created successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
};

module.exports.getTruck = async (req, res) => {
  const truck = await truckDao.getTruck({
    _id: req.params.id,
  });

  return res.status(200).json({
    truck,
  });
};

module.exports.putTruck = async (req, res) => {
  const truck = await truckDao.getTruck({
    $and: [{
      _id: req.params.id,
    },
    {
      assigned_to: {
        $ne: req.user._id,
      },
    },
    ],
  });

  truck.set(req.body);

  await truck.save();

  return res.status(200).json({
    message: 'Truck details changed successfully',
  });
};

module.exports.remove = async (req, res) => {
  await Truck.findByIdAndDelete(req.params.id, {
    assigned_to: {
      $ne: req.user._id,
    },
  });

  return res.status(200).json({
    message: 'Truck deleted successfully',
  });
};

module.exports.assign = async (req, res) => {
  Truck.findOne({
    _id: req.params.id,
  }, async function(error, truck) {
    if (error) {
      throw error;
    }
    truck.assigned_to = req.user;
    await truck.save();

    return res.status(200).json({
      message: 'Truck assigned successfully',
    });
  });
};
