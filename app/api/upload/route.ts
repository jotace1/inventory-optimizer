import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";

interface InventoryRecord {
  product_id: string;
  product_name: string;
  date: string;
  inventory_level: number;
  orders: number;
  lead_time_days: number;
}

interface ThresholdParams {
  leadTime: number;
  safetyStock: number;
  avgDailySales: number;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file: File | null = formData.get("file") as unknown as File;
    const leadTime = Number.parseFloat(formData.get("leadTime") as string);
    const safetyStock = Number.parseFloat(
      formData.get("safetyStock") as string
    );
    const avgDailySales = Number.parseFloat(
      formData.get("avgDailySales") as string
    );

    if (!file) {
      throw new Error("No file uploaded");
    }

    const contents = await file.text();

    if (!contents.trim()) {
      throw new Error("The uploaded file is empty");
    }

    let records: InventoryRecord[];
    try {
      records = parse(contents, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
      }) as InventoryRecord[];
    } catch (parseError) {
      throw new Error(`Failed to parse CSV: ${(parseError as Error).message}`);
    }

    if (records.length === 0) {
      throw new Error("No valid records found in CSV");
    }

    const processedData = validateAndProcessData(records);

    const thresholds = calculateThresholds(processedData, {
      leadTime,
      safetyStock,
      avgDailySales,
    });

    return NextResponse.json({ data: processedData, thresholds });
  } catch (error) {
    return NextResponse.json(
      { error: `Error processing data: ${(error as Error).message}` },
      { status: 400 }
    );
  }
}

function validateAndProcessData(records: InventoryRecord[]): InventoryRecord[] {
  return records.map((record, index) => {
    console.log(`Validating record ${index}:`, JSON.stringify(record, null, 2));

    if (
      !record.product_id ||
      !record.product_name ||
      !record.date ||
      isNaN(Number(record.inventory_level)) ||
      isNaN(Number(record.orders)) ||
      isNaN(Number(record.lead_time_days))
    ) {
      throw new Error(
        `Invalid record format at index ${index}: ${JSON.stringify(record)}`
      );
    }

    return {
      ...record,
      inventory_level: Number(record.inventory_level),
      orders: Number(record.orders),
      lead_time_days: Number(record.lead_time_days),
    };
  });
}

function calculateThresholds(data: InventoryRecord[], params: ThresholdParams) {
  const { leadTime, safetyStock, avgDailySales } = params;

  if (data.length === 0) {
    console.warn("No data available for threshold calculation");
    return { low: null, medium: null, high: null };
  }

  // Calculate order frequency (average days between orders)
  const orderDates = data
    .filter((record) => record.orders > 0)
    .map((record) => new Date(record.date));

  const orderIntervals = orderDates
    .slice(1)
    .map(
      (date, index) =>
        (date.getTime() - orderDates[index].getTime()) / (1000 * 60 * 60 * 24)
    );
  const avgOrderFrequency =
    orderIntervals.length > 0
      ? orderIntervals.reduce((sum, interval) => sum + interval, 0) /
        orderIntervals.length
      : 7; // Default to 7 days if no order data

  // Calculate average fulfillment time
  const avgFulfillmentTime =
    data.reduce((sum, record) => sum + record.lead_time_days, 0) / data.length;

  // Calculate thresholds
  const low = avgDailySales * (leadTime + avgFulfillmentTime);
  const medium = low + low * safetyStock;
  const high = medium * (1 + avgOrderFrequency / 30); // Adjust high threshold based on order frequency

  return {
    low: low.toFixed(2),
    medium: medium.toFixed(2),
    high: high.toFixed(2),
  };
}
