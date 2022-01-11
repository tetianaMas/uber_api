const {Load} = require('../models/loadModel');
const loadDao = require('../models/dao/loadDao');
const truckDao = require('../models/dao/truckDao');

module.exports.getLoads = async (req, res) => {
  const user = req.user;
  const queries = req.query;
  let loads;

  if (user.role.toLowerCase() === 'driver') {
    loads = await loadDao.getLoad({
      assigned_to: user._id,
    }, queries);

    return res.status(200).json({
      loads,
    });
  }

  if (user.role.toLowerCase() === 'shipper') {
    loads = await loadDao.getLoad({
      created_by: user._id,
    }, queries);

    return res.status(200).json({
      loads,
    });
  }
};

module.exports.addLoad = async (req, res) => {
  const user = req.user;

  await user.save(async (err) => {
    if (err) {
      return res.status(500).json({
        message: err.message,
      });
    }

    try {
      const load = new Load({
        name: req.body.name,
        payload: req.body.payload,
        pickup_address: req.body.pickup_address,
        delivery_address: req.body.delivery_address,
        dimensions: req.body.dimensions,
        created_by: user._id,
        status: 'NEW',
      });

      await load.postLog('Load created.');

      await load.save();

      return res.status(200).json({
        message: 'Load created successfully',
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  });
};

module.exports.getActive = async (req, res) => {
  const id = req.user._id;
  const load = await loadDao.getLoad({
    $and: [{
      assigned_to: id,
    }, {
      status: 'ASSIGNED',
    }],
  });

  if (load.length === 0) {
    return res.status(500).json({
      message: 'No active loads!',
    });
  }

  return res.status(200).json({
    load: load[0],
  });
};

module.exports.patchState = async (req, res) => {
  const load = (await loadDao.getLoad({
    $and: [{
      assigned_to: req.user._id,
    }, {
      status: 'ASSIGNED',
    }],
  }))[0];

  if (!load) {
    return res.status(500).json({
      message: 'No active loads!',
    });
  }

  const state = await load.iterateToNextState();

  if (load.status === 'SHIPPED') {
    const truck = await truckDao.getTruck({
      assigned_to: load.assigned_to,
    });

    truck.set('status', 'IS');
    await truck.save();
  }

  await load.postLog(state);
  await load.save();

  return res.status(200).json({
    message: `Load state changed to ${state}`,
  });
};

module.exports.getLoadById = async (req, res) => {
  const id = req.params.id;
  const load = (await loadDao.getLoad({
    _id: id,
  }))[0];

  if (!load) {
    throw new Error('No such load!');
  }

  return res.status(200).json({
    load,
  });
};

module.exports.putLoad = async (req, res) => {
  const id = req.params.id;
  const load = (await loadDao.getLoad({
    $and: [{
      _id: id,
    },
    {
      status: 'NEW',
    },
    ],
  }))[0];

  await Load.findByIdAndUpdate(id, req.body);

  await load.postLog('Load info has been updated.');
  await load.save();

  return res.status(200).json({
    message: 'Load details changed successfully',
  });
};

module.exports.deleteLoad = async (req, res) => {
  const id = req.params.id;
  await Load.findByIdAndDelete(id, {
    $and: [{
      _id: id,
    },
    {
      status: 'NEW',
    },
    ],
  });

  return res.status(200).json({
    message: 'Load deleted successfully',
  });
};

module.exports.getInfo = async (req, res) => {
  const id = req.params.id;
  const load = (await loadDao.getLoad({
    _id: id,
  }))[0];

  const truck = (await truckDao.getTruck({
    _id: load.assigned_to,
  }))[0];

  return res.status(200).json({
    load,
    truck,
  });
};

module.exports.postLoad = async (req, res) => {
  const id = req.params.id;
  const load = (await loadDao.getLoad({
    _id: id,
  }))[0];

  if (load.status !== 'NEW') {
    return res.status(400).json({
      message: 'Load is delivering!',
    });
  }

  await load.setStatus('POSTED');

  try {
    truckDao.getTruck({
      $and: [{
        status: 'IS',
      },
      {
        assigned_to: {
          $ne: null,
        },
      },
      ],
    },
    async function(error, trucks) {
      if (error) {
        throw error;
      }

      if (trucks.length === 0) {
        await load.setStatus('NEW');
        await load.postLog('Driver was not found.');
        await load.save();

        return res.status(500).json({
          message: 'Driver was not found.',
        });
      }

      if (trucks) {
        trucks.forEach((item) => {
          if (item.checkDimentionsAndSetLoad(load)) {
            return res.status(200).json({
              message: 'Load posted successfully',
              driver_found: true,
            });
          }
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
