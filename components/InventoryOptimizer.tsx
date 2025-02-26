"use client";

import { useState } from "react";
import FileUpload from "./FileUpload";
import InventoryChart from "./InventoryChart";
import ThresholdExport from "./ThresholdExport";
import { IInventoryRecord, IThreshold } from "@/types/types";

export default function InventoryOptimizer() {
  const [csvData, setCsvData] = useState<IInventoryRecord[]>(
    [] as IInventoryRecord[]
  );
  const [thresholds, setThresholds] = useState<IThreshold>({} as IThreshold);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUploadAndCalculate = async (file: any, params: any) => {
    setError(null);
    setCsvData([] as IInventoryRecord[]);
    setThresholds({} as IThreshold);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("leadTime", params.leadTime.toString());
    formData.append("safetyStock", params.safetyStock.toString());
    formData.append("avgDailySales", params.avgDailySales.toString());

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred");
      }

      if (!result.data || result.data.length === 0) {
        throw new Error("No valid data found in the uploaded file");
      }

      setCsvData(result.data);
      setThresholds(result.thresholds);
    } catch (error: any) {
      console.error("Error processing data:", error);
      setError(error.message || "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const isValidThresholds =
    thresholds &&
    typeof thresholds === "object" &&
    (thresholds.low != null ||
      thresholds.medium != null ||
      thresholds.high != null);

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Upload Inventory Data</h2>
        <FileUpload onFileUpload={handleFileUploadAndCalculate} />
      </div>
      {isLoading && (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-lg">Processing data...</p>
        </div>
      )}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      {csvData && csvData.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Chart</h2>
          <InventoryChart data={csvData} thresholds={thresholds} />
        </div>
      )}
      {isValidThresholds && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recommended Thresholds</h2>
          <ThresholdExport thresholds={thresholds} />
        </div>
      )}
    </div>
  );
}
