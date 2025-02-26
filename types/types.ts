export interface IThreshold {
  low: number;
  medium: number;
  high: number;
}

export interface IInventoryRecord {
  product_id: string;
  product_name: string;
  date: string;
  inventory_level: number;
  orders: number;
  lead_time_days: number;
}
