import React, { useState, useEffect } from 'react';
import { useQCData } from '../QCDataContext';

const StartQC = ({ onNext }) => {
  const { qcData, updateQCData } = useQCData();
  const [formData, setFormData] = useState({
    supplierName: qcData.supplierName || '',
    shipmentId: qcData.shipmentId || '',
    deliveryDateTime: qcData.deliveryDateTime || ''
  });

  // Auto-fill delivery date & time on component mount
  useEffect(() => {
    if (!formData.deliveryDateTime) {
      const now = new Date();
      const formattedDateTime = now.toISOString().slice(0, 16);
      setFormData(prev => ({
        ...prev,
        deliveryDateTime: formattedDateTime
      }));
    }
  }, []);

  const suppliers = [
    'ABC Manufacturing Co.',
    'XYZ Suppliers Ltd.',
    'Global Parts Inc.',
    'Premium Components',
    'Quality Materials Corp.',
    'Reliable Suppliers Co.'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (!formData.supplierName || formData.supplierName === 'Select Supplier') {
      alert('Please select a supplier');
      return;
    }
    if (!formData.shipmentId.trim()) {
      alert('Please enter a shipment ID');
      return;
    }

    updateQCData(formData);
    
    onNext();
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black mb-2">
            Start Quality Control
          </h1>
          <p className="text-gray-600 text-base">
            Enter shipment details to begin QC process
          </p>
        </div>

        <div className="space-y-8">
          <div className="space-y-2 relative">
            <label htmlFor="supplierName" className="text-sm font-medium text-black block">
              Supplier Name *
            </label>
            <select
              id="supplierName"
              name="supplierName"
              required
              value={formData.supplierName}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200 appearance-none"
            >
              {suppliers.map((supplier, index) => (
                <option key={index} value={supplier} disabled={index === 0}>
                  {supplier}
                </option>
              ))}
            </select>
            <div className="absolute right-0 top-8 pointer-events-none">
              <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="shipmentId" className="text-sm font-medium text-black block">
              Shipment ID *
            </label>
            <input
              id="shipmentId"
              name="shipmentId"
              type="text"
              required
              placeholder="Enter shipment ID"
              value={formData.shipmentId}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="deliveryDateTime" className="text-sm font-medium text-black block">
              Delivery Date & Time
            </label>
            <input
              id="deliveryDateTime"
              name="deliveryDateTime"
              type="datetime-local"
              value={formData.deliveryDateTime}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
            <p className="text-xs text-gray-500 mt-1">
              Auto-filled with current date and time
            </p>
          </div>

          <div className="pt-8">
            <button
              type="button"
              onClick={handleNext}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-medium py-4 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartQC;