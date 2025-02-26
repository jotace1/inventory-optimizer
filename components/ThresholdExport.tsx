import { IThreshold } from "@/types/types";
import { useState } from "react";

interface ThresholdExportProps {
  thresholds: IThreshold;
}

export default function ThresholdExport({ thresholds }: ThresholdExportProps) {
  const [copied, setCopied] = useState(false);

  if (!thresholds || typeof thresholds !== "object") {
    return (
      <div className="text-center text-gray-600">
        No threshold data available
      </div>
    );
  }

  const formatThreshold = (value: any) => {
    return value != null && !isNaN(value) ? Number(value).toFixed(2) : "N/A";
  };

  const handleCopy = () => {
    const formattedText = `
Threshold Levels:
- Low: ${formatThreshold(thresholds.low)}
- Medium: ${formatThreshold(thresholds.medium)}
- High: ${formatThreshold(thresholds.high)}
    `.trim();

    navigator.clipboard.writeText(formattedText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Threshold Levels
        </h2>
        <button
          onClick={handleCopy}
          className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-lg transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <ul className="space-y-2">
        <li className="flex justify-between">
          <span className="font-medium">Low:</span>
          <span className="text-red-600">
            {formatThreshold(thresholds.low)}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">Medium:</span>
          <span className="text-orange-600">
            {formatThreshold(thresholds.medium)}
          </span>
        </li>
        <li className="flex justify-between">
          <span className="font-medium">High:</span>
          <span className="text-green-600">
            {formatThreshold(thresholds.high)}
          </span>
        </li>
      </ul>
    </div>
  );
}
