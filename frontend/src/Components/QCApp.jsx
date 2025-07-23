import React, { useState } from 'react';
import { QCDataProvider } from './QCDataContext';
import { UnitDataProvider } from './UnitDataContext';
import StartQC from './subcomponents/StartQC';
import QCInspection from './subcomponents/QCInspection';
import UnitInspection from './subcomponents/UnitInspection';

// Main QC Application Component
const QCApp = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const goToNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const goBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  return (
    <QCDataProvider>
      <UnitDataProvider>
        <div>
          {currentStep === 1 && <StartQC onNext={goToNext} />}
          {currentStep === 2 && <QCInspection onNext={goToNext} onBack={goBack} />}
          {currentStep === 3 && <UnitInspection onNext={goToNext} onBack={goBack} />}
        </div>
      </UnitDataProvider>
    </QCDataProvider>
  );
};

export default QCApp;