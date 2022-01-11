const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const loadStates = require('./helpers/loadStates');

const loadSchema = new Schema({
  created_by: {
    type: String,
    default: null,
  },
  assigned_to: {
    type: String,
    default: null,
  },
  status: String,
  state: {
    type: String,
    default: null,
  },
  name: String,
  payload: Number,
  pickup_address: String,
  delivery_address: String,
  dimensions: {
    width: Number,
    length: Number,
    height: Number,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
  logs: Array,
});

loadSchema.methods.postLog = async function(message) {
  const arr = this.logs;

  arr.push({
    message,
    time: new Date(),
  });

  this.set('logs', arr);
};

loadSchema.methods.iterateToNextState = async function() {
  const currentState = this.state;
  if (!currentState) {
    this.state = loadStates.states[0];
  }
  const index = loadStates.states.indexOf(currentState);

  this.set('state', loadStates.states[index + 1]);

  if (this.state === loadStates.states[loadStates.states.length - 1]) {
    this.status = 'SHIPPED';
  }

  await this.save();

  return this.state;
};

loadSchema.methods.setStatus = async function(status) {
  this.set('status', status);

  return this.status;
};

module.exports.Load = mongoose.model('Load', loadSchema);
