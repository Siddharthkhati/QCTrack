import React, { useState } from 'react';
import { useQCData } from '../QCDataContext';

const QCInspection = ({ onNext, onBack }) => {
  const { qcData, updateQCData } = useQCData();
  const [formData, setFormData] = useState({
    totalUnits: qcData.totalUnits || '',
    packagingCondition: qcData.packagingCondition || { status: '', comments: '' },
    quantityMatch: qcData.quantityMatch || { status: '', comments: '' },
    outerBoxDamage: qcData.outerBoxDamage || { status: '', comments: '' },
    invoiceMatching: qcData.invoiceMatching || { status: '', comments: '' }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChecklistChange = (field, type, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [type]: value
      }
    }));
  };

  const handleNext = () => {
    if (!formData.totalUnits.trim()) {
      alert('Please enter total number of units');
      return;
    }

    const checklistFields = ['packagingCondition', 'quantityMatch', 'outerBoxDamage', 'invoiceMatching'];
    for (let field of checklistFields) {
      if (!formData[field].status) {
        alert(`Please select a quality rating for ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return;
      }
    }

    updateQCData(formData);
    
    if (onNext) {
      onNext();
    }
  };

  const checklistItems = [
    { key: 'packagingCondition', label: 'Packaging Condition' },
    { key: 'quantityMatch', label: 'Quantity Match' },
    { key: 'outerBoxDamage', label: 'Outer Box Damage' },
    { key: 'invoiceMatching', label: 'Invoice Matching' }
  ];

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black mb-2">
            Quality Control Inspection
          </h1>
          <p className="text-gray-600 text-base">
            Complete the inspection checklist
          </p>
        </div>

        {/* Form */}
        <div className="space-y-8">
          <div className="space-y-2">
            <label htmlFor="totalUnits" className="text-sm font-medium text-black block">
              Total Number of Units *
            </label>
            <input
              id="totalUnits"
              name="totalUnits"
              type="number"
              required
              placeholder="Enter total units"
              value={formData.totalUnits}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
          </div>

          {/* Checklist Items */}
          <div className="space-y-8">
            <h3 className="text-lg font-medium text-black">Inspection Checklist</h3>
            
            {checklistItems.map((item) => (
              <div key={item.key} className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <h4 className="text-base font-medium text-black">{item.label} *</h4>
                
                {/* Quality Rating Radio Buttons */}
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`${item.key}_status`}
                      value="Excellent"
                      checked={formData[item.key].status === 'Excellent'}
                      onChange={(e) => handleChecklistChange(item.key, 'status', e.target.value)}
                      className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-green-700 font-medium">Excellent</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`${item.key}_status`}
                      value="Very Good"
                      checked={formData[item.key].status === 'Very Good'}
                      onChange={(e) => handleChecklistChange(item.key, 'status', e.target.value)}
                      className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-green-600 font-medium">Very Good</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`${item.key}_status`}
                      value="Good"
                      checked={formData[item.key].status === 'Good'}
                      onChange={(e) => handleChecklistChange(item.key, 'status', e.target.value)}
                      className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-blue-600 font-medium">Good</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`${item.key}_status`}
                      value="Average"
                      checked={formData[item.key].status === 'Average'}
                      onChange={(e) => handleChecklistChange(item.key, 'status', e.target.value)}
                      className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-yellow-600 font-medium">Average</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`${item.key}_status`}
                      value="Poor"
                      checked={formData[item.key].status === 'Poor'}
                      onChange={(e) => handleChecklistChange(item.key, 'status', e.target.value)}
                      className="h-4 w-4 text-blue-900 border-gray-300 focus:ring-blue-900"
                    />
                    <span className="ml-2 text-sm text-red-600 font-medium">Poor</span>
                  </label>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    Comments (Optional)
                  </label>
                  <textarea
                    rows="3"
                    placeholder="Add any comments..."
                    value={formData[item.key].comments}
                    onChange={(e) => handleChecklistChange(item.key, 'comments', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-8 flex space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-4 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-medium py-4 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QCInspection;