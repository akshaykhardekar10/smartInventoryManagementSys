const express = require('express');
const router = express.Router();
const StockLog = require('../models/StockLog');
const Component = require('../models/Component');
const { auth } = require('../middlewares/auth');

// GET /api/stocklogs
router.get('/', auth, async (req, res) => {
  try {
    const { componentId, type, startDate, endDate } = req.query;
    const filter = {};

    if (componentId) filter.componentId = componentId;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const logs = await StockLog.find(filter)
      .populate('componentId', 'name partNumber')
      .populate('userId', 'name')
      .sort({ date: -1 });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/stocklogs
router.post('/', auth, async (req, res) => {
  try {
    const { componentId, quantity, reason, type, date } = req.body;

    if (!componentId || !quantity || !reason || !type) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!['inward', 'outward'].includes(type)) {
      return res.status(400).json({ message: 'Invalid type' });
    }

    const component = await Component.findById(componentId);
    if (!component) return res.status(404).json({ message: 'Component not found' });

    if (type === 'outward' && component.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const stockLog = new StockLog({
      componentId,
      userId: req.user._id,
      quantity,
      reason,
      type,
      date: date || new Date()
    });

    await stockLog.save();

    if (type === 'inward') {
      component.quantity += quantity;
    } else {
      component.quantity -= quantity;
      component.lastOutwardedAt = new Date();
    }

    await component.save();
    await stockLog.populate('componentId', 'name partNumber');
    await stockLog.populate('userId', 'name');

    res.status(201).json(stockLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/stocklogs/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const stockLog = await StockLog.findById(req.params.id)
      .populate('componentId', 'name partNumber')
      .populate('userId', 'name');

    if (!stockLog) return res.status(404).json({ message: 'Log not found' });
    res.json(stockLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
