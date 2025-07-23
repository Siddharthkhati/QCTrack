const express = require('express');
const router = express.Router();
const Inspection = require('../models/Inspection'); 
router.post('/', async (req, res) => {
  const inspectionData = req.body; 

  if (!inspectionData || !inspectionData.shipmentId || !inspectionData.supplierName || !inspectionData.deliveryDateTime || !inspectionData.totalUnits) {
    return res.status(400).json({ message: 'Missing essential QC inspection data fields.' });
  }

  try {
    const existingInspection = await Inspection.findOne({ shipmentId: inspectionData.shipmentId });
    if (existingInspection) {
      return res.status(409).json({ message: 'Inspection record for this Shipment ID already exists.' });
    }
    const newInspection = new Inspection({
      supplierName: inspectionData.supplierName,
      shipmentId: inspectionData.shipmentId,
      deliveryDateTime: inspectionData.deliveryDateTime,
      totalUnits: parseInt(inspectionData.totalUnits), 
      packagingCondition: inspectionData.packagingCondition,
      quantityMatch: inspectionData.quantityMatch,
      outerBoxDamage: inspectionData.outerBoxDamage,
      invoiceMatching: inspectionData.invoiceMatching
    });

    await newInspection.save();

    res.status(201).json({ message: 'Inspection data saved successfully!', inspectionId: newInspection._id });

  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({ message: 'Validation error', errors });
    }
    res.status(500).json({ message: 'Server error occurred while saving inspection data.' });
  }
});

module.exports = router;
