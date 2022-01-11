const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {truckTypes} = require('../controllers/helpers/truckTypes');

const truckSchema = new Schema({
  created_by: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  assigned_to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'IS',
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

truckSchema.methods.setStatus = async function(status) {
  this.set('status', status);

  await this.save();

  return this.status;
};

truckSchema.methods.checkDimentionsAndSetLoad = async function(load) {
  const currentType = truckTypes[this.type];

  if (currentType.payload > load.payload &&
    currentType.dimensions.width > load.dimensions.width &&
    currentType.dimensions.length > load.dimensions.length &&
    currentType.dimensions.height > load.dimensions.height) {
    load.assigned_to = this.assigned_to;

    await load.setStatus('ASSIGNED');
    await load.iterateToNextState();
    await load.postLog(`Load assigned to driver with id ${this.assigned_to}.`);
    await load.save();
    this.setStatus('OL');

    return true;
  } else {
    return false;
  }
};

module.exports.Truck = mongoose.model('Truck', truckSchema);
