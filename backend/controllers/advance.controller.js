const Advance = require('../models/Advance');

exports.getAdvances = async (req, res) => {
  try {
    const advances = await Advance.find()
      .populate('component', 'name')
      .populate('createdBy', 'name email')
      .sort({ date: -1 });

    const advancesWithBalance = advances.map(adv => {
      const totalAdjustments = adv.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
      return {
        ...adv.toObject(),
        currentBalance: adv.totalAdvanceAmount - totalAdjustments,
      };
    });

    res.json(advancesWithBalance);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching advances', error: err.message });
  }
};

exports.getAdvanceById = async (req, res) => {
  try {
    const { advanceId } = req.params;
    const advance = await Advance.findById(advanceId)
      .populate('component', 'name')
      .populate('createdBy', 'name email');

    if (!advance) {
      return res.status(404).json({ message: 'Advance not found' });
    }

    const totalAdjustments = advance.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const response = {
      ...advance.toObject(),
      currentBalance: advance.totalAdvanceAmount - totalAdjustments,
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching advance', error: err.message });
  }
};

exports.addAdjustment = async (req, res) => {
  try {
    const { advanceId } = req.params;
    const { date, amount, remark } = req.body;

    const advance = await Advance.findById(advanceId);
    if (!advance) {
      return res.status(404).json({ message: 'Advance not found' });
    }

    const totalAdjustments = advance.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const currentBalance = advance.totalAdvanceAmount - totalAdjustments;

    if (amount > currentBalance) {
      return res.status(400).json({ message: 'Adjustment amount cannot exceed current balance' });
    }

    advance.adjustments.push({
      date,
      amount,
      remark,
    });

    await advance.save();

    const newTotalAdjustments = advance.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
    const response = {
      ...advance.toObject(),
      currentBalance: advance.totalAdvanceAmount - newTotalAdjustments,
    };

    res.json({ message: 'Adjustment added', advance: response });
  } catch (err) {
    res.status(500).json({ message: 'Error adding adjustment', error: err.message });
  }
};

exports.getMonthlyAdvanceReport = async (req, res) => {
  try {
    const { month, year } = req.query;

    const advances = await Advance.find({
      $expr: {
        $and: [
          { $eq: [{ $month: '$date' }, parseInt(month)] },
          { $eq: [{ $year: '$date' }, parseInt(year)] },
        ],
      },
    }).populate('component', 'name');

    const report = advances.map(adv => {
      const totalAdjustments = adv.adjustments.reduce((sum, adj) => sum + adj.amount, 0);
      return {
        date: adv.date,
        partyName: adv.partyName,
        component: adv.component.name,
        presentAdvance: adv.totalAdvanceAmount,
        adjusted: totalAdjustments,
        remaining: adv.totalAdvanceAmount - totalAdjustments,
      };
    });

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching monthly advance report', error: err.message });
  }
};
