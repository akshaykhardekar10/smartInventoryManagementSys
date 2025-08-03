const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { auth, requireRole } = require('../middlewares/auth');
const { generateQRCode } = require('../utils/qrGenerator');
const multer = require('multer');
const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const upload = multer({ dest: 'uploads/' });

// @route   GET /api/components
router.get('/', auth, async (req, res) => {
  try {
    const { category, partNumber, quantity, location, search } = req.query;
    const filter = {};

    if (category) filter.category = new RegExp(category, 'i');
    if (partNumber) filter.partNumber = new RegExp(partNumber, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (quantity) filter.quantity = { $lte: parseInt(quantity) };
    if (search) {
      filter.$or = [
        { name: new RegExp(search, 'i') },
        { partNumber: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }

    const components = await Component.find(filter).sort({ createdAt: -1 });
    res.json(components);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/components/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/components
router.post('/', auth, requireRole(['admin']), async (req, res) => {
  try {
    const {
      name,
      partNumber,
      category,
      quantity,
      location,
      datasheetLink,
      unitPrice,
      criticalThreshold
    } = req.body;

    const existingComponent = await Component.findOne({ partNumber });
    if (existingComponent) return res.status(400).json({ message: 'Part number already exists' });

    const qrCode = await generateQRCode({ partNumber, name, location });

    const component = new Component({
      name,
      partNumber,
      category,
      quantity,
      location,
      datasheetLink,
      unitPrice,
      criticalThreshold,
      qrCode
    });

    await component.save();
    res.status(201).json(component);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/components/:id
router.put('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });

    const {
      name,
      partNumber,
      category,
      quantity,
      location,
      datasheetLink,
      unitPrice,
      criticalThreshold
    } = req.body;

    if (partNumber && partNumber !== component.partNumber) {
      const existing = await Component.findOne({ partNumber });
      if (existing) return res.status(400).json({ message: 'Part number already exists' });
    }

    component.name = name || component.name;
    component.partNumber = partNumber || component.partNumber;
    component.category = category || component.category;
    component.quantity = quantity ?? component.quantity;
    component.location = location || component.location;
    component.datasheetLink = datasheetLink || component.datasheetLink;
    component.unitPrice = unitPrice ?? component.unitPrice;
    component.criticalThreshold = criticalThreshold ?? component.criticalThreshold;

    if (partNumber !== component.partNumber || location !== component.location) {
      component.qrCode = await generateQRCode({ partNumber, name, location });
    }

    await component.save();
    res.json(component);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/components/:id
router.delete('/:id', auth, requireRole(['admin']), async (req, res) => {
  try {
    const component = await Component.findById(req.params.id);
    if (!component) return res.status(404).json({ message: 'Component not found' });

    await Component.findByIdAndDelete(req.params.id);
    res.json({ message: 'Component deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/components/bulk-import
router.post('/bulk-import', auth, requireRole(['admin']), upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const ext = path.extname(req.file.originalname).toLowerCase();
    let components = [];

    if (ext === '.csv') {
      components = await csv().fromFile(req.file.path);
    } else if (ext === '.json') {
      const raw = fs.readFileSync(req.file.path, 'utf8');
      components = JSON.parse(raw);
    } else {
      return res.status(400).json({ error: 'Unsupported file type. Use CSV or JSON.' });
    }

    const enriched = await Promise.all(components.map(async item => {
      const qrCode = await generateQRCode({ partNumber: item.partNumber, name: item.name, location: item.location });
      return { ...item, qrCode, createdAt: item.createdAt ? new Date(item.createdAt) : new Date() };
    }));

    await Component.insertMany(enriched);
    res.json({ success: true, count: enriched.length });
  } catch (err) {
    res.status(400).json({ error: err.message });
  } finally {
    if (req.file?.path) fs.unlink(req.file.path, () => {});
  }
});

module.exports = router;
