const express = require('express');
const router = express.Router();
const StockLog = require('../models/StockLog');
const Component = require('../models/Component');
const { auth } = require('../middlewares/auth');

// GET /api/dashboard/stats
router.get('/stats', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const monthlyData = await StockLog.aggregate([
      { $match: Object.keys(dateFilter).length ? { date: dateFilter } : {} },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          totalQuantity: { $sum: '$quantity' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    const lowStock = await Component.find({
      $expr: { $lte: ['$quantity', '$criticalThreshold'] }
    }).select('name partNumber quantity criticalThreshold location');

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const oldStock = await Component.find({
      $or: [
        { lastOutwardedAt: { $lt: threeMonthsAgo } },
        { lastOutwardedAt: { $exists: false } }
      ]
    }).select('name partNumber quantity lastOutwardedAt location');

    const totalComponents = await Component.countDocuments();
    const totalValueAgg = await Component.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ['$quantity', '$unitPrice'] } } } }
    ]);
    const totalValue = totalValueAgg[0]?.total || 0;

    res.json({
      monthlyData,
      lowStockComponents: lowStock,
      oldStockComponents: oldStock,
      totalComponents,
      totalValue
    });
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/dashboard/charts
router.get('/charts', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const dateFilter = {};

    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate) dateFilter.$lte = new Date(endDate);

    const monthlyData = await StockLog.aggregate([
      { $match: Object.keys(dateFilter).length ? { date: dateFilter } : {} },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type',
          },
          totalQuantity: { $sum: '$quantity' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const labelSet = new Set();
    const inwardMap = {};
    const outwardMap = {};

    monthlyData.forEach(({ _id, totalQuantity }) => {
      const label = `${monthNames[_id.month - 1]} ${_id.year}`;
      labelSet.add(label);
      if (_id.type === 'inward') {
        inwardMap[label] = totalQuantity;
      } else if (_id.type === 'outward') {
        outwardMap[label] = totalQuantity;
      }
    });

    const labels = Array.from(labelSet).sort((a, b) => {
      const [ma, ya] = a.split(' ');
      const [mb, yb] = b.split(' ');
      return new Date(`${ma} 1, ${ya}`) - new Date(`${mb} 1, ${yb}`);
    });

    const inward = labels.map(label => inwardMap[label] || 0);
    const outward = labels.map(label => outwardMap[label] || 0);

    res.json({ labels, inward, outward });
  } catch (error) {
    console.error('Error in /charts:', error);
    res.status(500).json({ message: 'Failed to load chart data' });
  }
});

module.exports = router;
