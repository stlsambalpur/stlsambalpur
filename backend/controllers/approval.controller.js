const CashbookEntry = require('../models/CashbookEntry');
const Component = require('../models/Component');
const Advance = require('../models/Advance');
const User = require('../models/User');

exports.approveCashbookEntry = async (req, res) => {
  try {
    const { entryId } = req.params;

    const entry = await CashbookEntry.findByIdAndUpdate(
      entryId,
      { status: 'Approved', approvedBy: req.user.id },
      { new: true }
    ).populate('component createdBy');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry approved', entry });
  } catch (err) {
    res.status(500).json({ message: 'Error approving entry', error: err.message });
  }
};

exports.denyCashbookEntry = async (req, res) => {
  try {
    const { entryId } = req.params;
    const { denialReason } = req.body;

    if (!denialReason) {
      return res.status(400).json({ message: 'Denial reason is required' });
    }

    const entry = await CashbookEntry.findByIdAndUpdate(
      entryId,
      { status: 'Rejected', approvedBy: req.user.id, denialReason },
      { new: true }
    ).populate('component createdBy');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry denied', entry });
  } catch (err) {
    res.status(500).json({ message: 'Error denying entry', error: err.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const deniedEntries = await CashbookEntry.find({
      createdBy: req.user.id,
      status: 'Rejected',
    }).populate('component', 'name');

    res.json(deniedEntries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications', error: err.message });
  }
};
