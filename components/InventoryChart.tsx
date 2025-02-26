"use client";

import { IInventoryRecord, IThreshold } from "@/types/types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

interface InventoryChartProps {
  data: IInventoryRecord[];
  thresholds: IThreshold;
}

export default function InventoryChart({
  data,
  thresholds,
}: InventoryChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600">
        No data available for chart
      </div>
    );
  }

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={[
              0,
              Math.max(
                ...data.map((d: IInventoryRecord) => d.inventory_level),
                Math.ceil(thresholds.high)
              ) + 100,
            ]}
          />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="inventory_level"
            stroke="#8884d8"
            name="Inventory Level"
          />
          {thresholds && (
            <>
              <ReferenceLine y={thresholds.low} label="Low" stroke="red" />
              <ReferenceLine
                y={thresholds.medium}
                label="Medium"
                stroke="orange"
              />
              <ReferenceLine y={thresholds.high} label="High" stroke="green" />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
