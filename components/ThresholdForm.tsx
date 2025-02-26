"use client";

import { useState } from "react";

interface ThresholdFormProps {
  onSubmit: (params: any) => void;
}

export default function ThresholdForm({ onSubmit }: ThresholdFormProps) {
  const [params, setParams] = useState({
    leadTime: 5,
    safetyStock: 0.2,
    avgDailySales: 20,
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setParams((prev) => ({ ...prev, [name]: Number.parseFloat(value) }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label
          htmlFor="leadTime"
          className="block text-sm font-medium text-gray-700"
        >
          Lead Time (days)
        </label>
        <input
          type="number"
          id="leadTime"
          name="leadTime"
          value={params.leadTime}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div>
        <label
          htmlFor="safetyStock"
          className="block text-sm font-medium text-gray-700"
        >
          Safety Stock (%)
        </label>
        <input
          type="number"
          id="safetyStock"
          name="safetyStock"
          value={params.safetyStock}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          step="0.01"
          required
        />
      </div>
      <div>
        <label
          htmlFor="avgDailySales"
          className="block text-sm font-medium text-gray-700"
        >
          Average Daily Sales
        </label>
        <input
          type="number"
          id="avgDailySales"
          name="avgDailySales"
          value={params.avgDailySales}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Calculate Thresholds
      </button>
    </form>
  );
}
