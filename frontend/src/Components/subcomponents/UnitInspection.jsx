import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQCData } from "../QCDataContext"; // Adjust path if necessary
import { useUnitData } from "../UnitDataContext"; // Adjust path if necessary

const UnitInspection = ({ onNext, onBack }) => {
  const { qcData } = useQCData();
  const { unitData, addUnit, updateUnit, getUnitCount } = useUnitData();

  const navigate = useNavigate();

  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [formData, setFormData] = useState({
    unitId: "",
    barcodeScanned: "",
    labelCondition: "",
    manufacturingDate: "",
    expiryDate: "",
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  // New state to control visibility of buttons
  const [isDataSuccessfullyInserted, setIsDataSuccessfullyInserted] = useState(false);

  const totalUnits = parseInt(qcData.totalUnits) || 0;
  const currentUnitNumber = currentUnitIndex + 1;

  // Initialize form data when switching units
  useEffect(() => {
    if (unitData[currentUnitIndex]) {
      setFormData(unitData[currentUnitIndex]);
    } else {
      setFormData({
        unitId: "",
        barcodeScanned: "",
        labelCondition: "",
        manufacturingDate: "",
        expiryDate: "",
      });
    }
  }, [currentUnitIndex, unitData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBarcodeInput = (e) => {
    if (!formData.unitId && e.target.value) {
      setFormData((prev) => ({
        ...prev,
        unitId: `UNIT-${e.target.value}`,
        barcodeScanned: e.target.value,
      }));
    } else {
      handleInputChange(e);
    }
  };

  const handleSaveUnit = () => {
    if (!formData.unitId.trim()) {
      alert("Please enter Unit ID/SKU");
      return false;
    }
    if (!formData.barcodeScanned.trim()) {
      alert("Please scan/enter barcode");
      return false;
    }
    if (!formData.labelCondition) {
      alert("Please select label condition");
      return false;
    }
    if (!formData.manufacturingDate) {
      alert("Please select manufacturing date");
      return false;
    }
    if (!formData.expiryDate) {
      alert("Please select expiry date");
      return false;
    }

    const unitWithShipmentId = {
      ...formData,
      shipmentId: qcData.shipmentId,
    };

    if (unitData[currentUnitIndex]) {
      updateUnit(currentUnitIndex, unitWithShipmentId);
    } else {
      addUnit(unitWithShipmentId);
    }

    alert(`Unit ${currentUnitNumber} saved successfully!`);
    return true;
  };

  const handleNextUnit = () => {
    if (handleSaveUnit()) {
      if (currentUnitIndex < totalUnits - 1) {
        setCurrentUnitIndex((prev) => prev + 1);
      }
    }
  };

  const handlePrevUnit = () => {
    if (currentUnitIndex > 0) {
      setCurrentUnitIndex((prev) => prev - 1);
    }
  };

  const sendInspectionData = async () => {
    setIsSubmitting(true);
    setSubmissionStatus("Submitting...");
    try {
      const qcDataToSend = {
        supplierName: qcData.supplierName,
        shipmentId: qcData.shipmentId,
        deliveryDateTime: qcData.deliveryDateTime,
        totalUnits: parseInt(qcData.totalUnits),
        packagingCondition: qcData.packagingCondition,
        quantityMatch: qcData.quantityMatch,
        outerBoxDamage: qcData.outerBoxDamage,
        invoiceMatching: qcData.invoiceMatching,
      };

      const qcResponse = await fetch("http://localhost:4000/api/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(qcDataToSend),
      });

      const qcResult = await qcResponse.json();

      if (!qcResponse.ok) {
        setSubmissionStatus(
          `Failed to save QC inspection: ${qcResult.message || "Unknown error"}`
        );
        alert(
          `Failed to save QC inspection: ${qcResult.message || "Unknown error"}`
        );
        setIsSubmitting(false);
        setShowConfirmModal(false);
        return;
      }
      setSubmissionStatus("QC inspection data saved. Submitting unit data...");

      const unitDataToSend = unitData;
      if (unitDataToSend.length > 0) {
        const unitResponse = await fetch(
          "http://localhost:4000/api/unit-inspections",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(unitDataToSend),
          }
        );

        const unitResult = await unitResponse.json();

        if (!unitResponse.ok) {
          setSubmissionStatus(
            `Failed to save unit inspections: ${
              unitResult.message || "Unknown error"
            }`
          );
          alert(
            `Failed to save unit inspections: ${
              unitResult.message || "Unknown error"
            }`
          );
          setIsSubmitting(false);
          setShowConfirmModal(false);
          return;
        }
      }

      setSubmissionStatus("All inspection data saved successfully!");
      alert("All inspection data saved successfully!");
      // Set the new state to true upon successful submission
      setIsDataSuccessfullyInserted(true);
      navigate("/start-qc");
    } catch (error) {
      setSubmissionStatus("Network error: Could not connect to the server.");
      alert(
        "Network error: Could not connect to the server to save inspection data."
      );
    } finally {
      setIsSubmitting(false);
      setShowConfirmModal(false);
    }
  };

  const handleFinish = () => {
    if (!handleSaveUnit()) {
      return;
    }

    if (getUnitCount() < totalUnits) {
      setShowConfirmModal(true);
    } else {
      sendInspectionData();
    }
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="mb-12">
          <h1 className="text-3xl font-light text-black mb-2">
            Unit Level Inspection
          </h1>
          <p className="text-gray-600 text-base">
            Inspect individual units ({currentUnitNumber} of {totalUnits})
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>
              {getUnitCount()} / {totalUnits} units completed
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-900 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(getUnitCount() / totalUnits) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <button
            onClick={handlePrevUnit}
            disabled={currentUnitIndex === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous Unit
          </button>

          <div className="text-center">
            <h3 className="text-lg font-medium text-black">
              Unit {currentUnitNumber}
            </h3>
            <p className="text-sm text-gray-600">
              {unitData[currentUnitIndex] ? "Saved" : "Not saved"}
            </p>
          </div>

          <button
            onClick={handleNextUnit}
            disabled={currentUnitIndex >= totalUnits - 1}
            className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next Unit →
          </button>
        </div>

        <div className="space-y-8">
          <div className="space-y-2">
            <label
              htmlFor="unitId"
              className="text-sm font-medium text-black block"
            >
              Unit ID / SKU *
            </label>
            <input
              id="unitId"
              name="unitId"
              type="text"
              required
              placeholder="Enter or auto-generate unit ID"
              value={formData.unitId}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="barcodeScanned"
              className="text-sm font-medium text-black block"
            >
              Barcode Scan *
            </label>
            <input
              id="barcodeScanned"
              name="barcodeScanned"
              type="text"
              required
              placeholder="Scan or enter barcode"
              value={formData.barcodeScanned}
              onChange={handleBarcodeInput}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black placeholder-gray-400 focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
            <p className="text-xs text-gray-500">
              Tip: Unit ID will be auto-generated if empty
            </p>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-black block">
              Label Condition *
            </label>
            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labelCondition"
                  value="Pass"
                  checked={formData.labelCondition === "Pass"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-green-600 border-gray-300 focus:ring-green-600"
                />
                <span className="ml-2 text-sm text-black">Pass</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="labelCondition"
                  value="Fail"
                  checked={formData.labelCondition === "Fail"}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-600"
                />
                <span className="ml-2 text-sm text-black">Fail</span>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="manufacturingDate"
              className="text-sm font-medium text-black block"
            >
              Manufacturing Date *
            </label>
            <input
              id="manufacturingDate"
              name="manufacturingDate"
              type="date"
              required
              value={formData.manufacturingDate}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="expiryDate"
              className="text-sm font-medium text-black block"
            >
              Expiry Date *
            </label>
            <input
              id="expiryDate"
              name="expiryDate"
              type="date"
              required
              value={formData.expiryDate}
              onChange={handleInputChange}
              className="w-full px-0 py-3 bg-transparent border-0 border-b-2 border-black text-black focus:outline-none focus:border-b-2 focus:border-black transition-colors duration-200"
            />
          </div>

          <div className="pt-4">
            <button
              type="button"
              onClick={handleSaveUnit}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2"
            >
              Save Unit {currentUnitNumber}
            </button>
          </div>
          {submissionStatus && (
            <div
              className={`py-2 text-center text-sm font-medium ${
                submissionStatus.includes("success")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {submissionStatus}
            </div>
          )}

          {/* Conditionally render the button div */}
          {!isDataSuccessfullyInserted && (
            <div className="pt-8 flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-4 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
              >
                Back to QC Inspection
              </button>
              <button
                type="button"
                onClick={handleFinish}
                disabled={isSubmitting}
                className="flex-1 bg-blue-900 hover:bg-blue-800 text-white font-medium py-4 px-6 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Finishing..." : "Finish Inspection"}
              </button>
            </div>
          )}
        </div>
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Confirm Completion
              </h3>
              <p className="text-gray-700 mb-6">
                You have only inspected {getUnitCount()} out of {totalUnits}{" "}
                units. {totalUnits - getUnitCount()} units remaining. Do you
                want to proceed?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={sendInspectionData}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Proceeding..." : "Proceed Anyway"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitInspection;