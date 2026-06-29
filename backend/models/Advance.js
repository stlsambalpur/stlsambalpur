const mongoose = require('mongoose');

const adjustmentSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  remark: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const advanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  partyName: {
    type: String,
    required: true,
  },
  component: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Component',
    required: true,
  },
  totalAdvanceAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  adjustments: [adjustmentSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  financialYear: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

advanceSchema.virtual('currentBalance').get(function() {
  const totalAdjustments = this.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
  return this.totalAdvanceAmount - totalAdjustments;
});

module.exports = mongoose.model('Advance', advanceSchema);
