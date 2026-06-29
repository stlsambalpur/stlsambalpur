const CashbookEntry = require('../models/CashbookEntry');
const Component = require('../models/Component');
const Advance = require('../models/Advance');
const moment = require('moment');

function getFinancialYear(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  if (month >= 4) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

exports.createEntry = async (req, res) => {
  try {
    const {
      date,
      partyName,
      component,
      details,
      amount,
      transactionType,
      paymentMethod,
      cashAmount,
      accountAmount,
      isAdvance,
      advancePurpose,
      voucherNo,
    } = req.body;

    const comp = await Component.findById(component);
    if (!comp || comp.status !== 'Approved') {
      return res.status(400).json({ message: 'Component not approved or does not exist' });
    }

    if (paymentMethod === 'Both') {
      if (!cashAmount || !accountAmount) {
        return res.status(400).json({ message: 'Cash and Account amounts required when Both is selected' });
      }
      if (cashAmount + accountAmount !== amount) {
        return res.status(400).json({ message: 'Cash and Account amounts must sum to total amount' });
      }
    }

    const financialYear = getFinancialYear(date);

    const entry = new CashbookEntry({
      date,
      partyName,
      component,
      details,
      amount,
      transactionType,
      paymentMethod,
      cashAmount: paymentMethod === 'Cash' ? amount : (paymentMethod === 'Both' ? cashAmount : 0),
      accountAmount: paymentMethod === 'Account' ? amount : (paymentMethod === 'Both' ? accountAmount : 0),
      isAdvance,
      advancePurpose,
      voucherNo,
      financialYear,
      createdBy: req.user.id,
      status: 'Pending',
    });

    await entry.save();

    if (isAdvance) {
      const advance = new Advance({
        date,
        partyName,
        component,
        totalAdvanceAmount: amount,
        financialYear,
        createdBy: req.user.id,
      });
      await advance.save();
    }

    res.status(201).json({ message: 'Entry created and awaiting approval', entry });
  } catch (err) {
    res.status(500).json({ message: 'Error creating entry', error: err.message });
  }
};

exports.getLastVoucherNo = async (req, res) => {
  try {
    const financialYear = req.query.financialYear;
    const lastEntry = await CashbookEntry.findOne({ financialYear })
      .sort({ voucherNo: -1 })
      .select('voucherNo');

    const lastVoucherNo = lastEntry ? lastEntry.voucherNo : 0;
    res.json({ lastVoucherNo });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching last voucher number', error: err.message });
  }
};

exports.getPendingEntries = async (req, res) => {
  try {
    const entries = await CashbookEntry.find({ status: 'Pending' })
      .populate('component', 'name')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending entries', error: err.message });
  }
};

exports.getApprovedEntries = async (req, res) => {
  try {
    const entries = await CashbookEntry.find({ status: 'Approved' })
      .populate('component', 'name')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching approved entries', error: err.message });
  }
};

exports.getUserEntries = async (req, res) => {
  try {
    const entries = await CashbookEntry.find({ createdBy: req.user.id })
      .populate('component', 'name')
      .sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching entries', error: err.message });
  }
};
