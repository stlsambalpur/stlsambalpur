const Component = require('../models/Component');

exports.createComponent = async (req, res) => {
  try {
    const { name, code, description, requestedBy } = req.body;

    const existingComponent = await Component.findOne({ name });
    if (existingComponent) {
      return res.status(400).json({ message: 'Component already exists' });
    }

    const component = new Component({
      name,
      code,
      description,
      requestedBy: req.user.id,
      status: req.user.role === 'Admin' ? 'Approved' : 'Pending',
    });

    await component.save();
    res.status(201).json({ message: 'Component created', component });
  } catch (err) {
    res.status(500).json({ message: 'Error creating component', error: err.message });
  }
};

exports.getApprovedComponents = async (req, res) => {
  try {
    const components = await Component.find({ status: 'Approved' });
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching components', error: err.message });
  }
};

exports.getAllComponents = async (req, res) => {
  try {
    const components = await Component.find()
      .populate('requestedBy', 'name email')
      .populate('approvedBy', 'name email');
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching components', error: err.message });
  }
};

exports.approveComponent = async (req, res) => {
  try {
    const { componentId } = req.params;
    const component = await Component.findByIdAndUpdate(
      componentId,
      { status: 'Approved', approvedBy: req.user.id },
      { new: true }
    ).populate('requestedBy', 'name email');

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json({ message: 'Component approved', component });
  } catch (err) {
    res.status(500).json({ message: 'Error approving component', error: err.message });
  }
};

exports.rejectComponent = async (req, res) => {
  try {
    const { componentId } = req.params;
    const { reason } = req.body;

    const component = await Component.findByIdAndUpdate(
      componentId,
      { status: 'Rejected', rejectionReason: reason, approvedBy: req.user.id },
      { new: true }
    ).populate('requestedBy', 'name email');

    if (!component) {
      return res.status(404).json({ message: 'Component not found' });
    }

    res.json({ message: 'Component rejected', component });
  } catch (err) {
    res.status(500).json({ message: 'Error rejecting component', error: err.message });
  }
};

exports.getPendingComponents = async (req, res) => {
  try {
    const components = await Component.find({ status: 'Pending' })
      .populate('requestedBy', 'name email');
    res.json(components);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending components', error: err.message });
  }
};
