import React, { createContext, useContext, useState } from 'react';

const UnitDataContext = createContext();

export const UnitDataProvider = ({ children }) => {
  const [unitData, setUnitData] = useState([]);

  const addUnit = (unit) => {
    setUnitData(prev => [...prev, unit]);
  };

  const updateUnit = (index, updatedUnit) => {
    setUnitData(prev => prev.map((unit, i) => i === index ? updatedUnit : unit));
  };

  const removeUnit = (index) => {
    setUnitData(prev => prev.filter((_, i) => i !== index));
  };

  const clearUnits = () => {
    setUnitData([]);
  };

  const getUnitCount = () => {
    return unitData.length;
  };

  return (
    <UnitDataContext.Provider value={{
      unitData,
      addUnit,
      updateUnit,
      removeUnit,
      clearUnits,
      getUnitCount
    }}>
      {children}
    </UnitDataContext.Provider>
  );
};

export const useUnitData = () => {
  const context = useContext(UnitDataContext);
  if (!context) {
    throw new Error('useUnitData must be used within a UnitDataProvider');
  }
  return context;
};