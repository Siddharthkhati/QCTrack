import React, { createContext, useContext, useState } from 'react';

const QCDataContext = createContext();

export const QCDataProvider = ({ children }) => {
  const [qcData, setQcData] = useState({
    // Step 1 data
    supplierName: '',
    shipmentId: '',
    deliveryDateTime: '',
    // Step 2 data
    totalUnits: '',
    packagingCondition: { status: '', comments: '' },
    quantityMatch: { status: '', comments: '' },
    outerBoxDamage: { status: '', comments: '' },
    invoiceMatching: { status: '', comments: '' }
  });

  const updateQCData = (newData) => {
    setQcData(prev => ({
      ...prev,
      ...newData
    }));
  };

  return (
    <QCDataContext.Provider value={{ qcData, updateQCData }}>
      {children}
    </QCDataContext.Provider>
  );
};

export const useQCData = () => {
  const context = useContext(QCDataContext);
  if (!context) {
    throw new Error('useQCData must be used within QCDataProvider');
  }
  return context;
};