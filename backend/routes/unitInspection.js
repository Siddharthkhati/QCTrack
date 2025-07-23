const express = require('express');
const router = express.Router();
const UnitInspection = require('../models/UnitInspection');

router.post('/', async (req, res) => {
  const unitDataArray = req.body; 
  if (!Array.isArray(unitDataArray) || unitDataArray.length === 0) {
    return res.status(400).json({ message: 'No unit inspection data provided or data is not an array.' });
  }

  try {
    for (const unit of unitDataArray) {
      if (!unit.unitId || !unit.barcodeScanned || !unit.labelCondition || !unit.manufacturingDate || !unit.expiryDate || !unit.shipmentId) {
        return res.status(400).json({ message: 'One or more unit records are missing required fields.' });
      }
      unit.manufacturingDate = new Date(unit.manufacturingDate);
      unit.expiryDate = new Date(unit.expiryDate);
    }

    const result = await UnitInspection.insertMany(unitDataArray);

    res.status(201).json({ message: 'Unit inspection data saved successfully!', insertedCount: result.length });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: 'Validation error for unit data', errors });
    }
    res.status(500).json({ message: 'Server error occurred while saving unit inspection data.' });
  }
});

module.exports = router;
