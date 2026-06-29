const mongoose = require('mongoose');

const cashbookEntrySchema = new mongoose.Schema({
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
  details: String,
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  transactionType: {
    type: String,
    enum: ['Debit', 'Credit'],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Account', 'Both'],
    required: true,
  },
  cashAmount: {
    type: Number,
    default: 0,
  },
  accountAmount: {
    type: Number,
    default: 0,
  },
  isAdvance: {
    type: Boolean,
    default: false,
  },
  advancePurpose: String,
  voucherNo: Number,
  financialYear: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  denialReason: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cashbookEntrySchema.index({ voucherNo: 1, financialYear: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('CashbookEntry', cashbookEntrySchema);
