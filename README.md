### Documentation

#### Component Architecture

1. `InventoryOptimizer`: The main component that orchestrates the application flow. It manages the state for CSV data and calculated thresholds, and renders child components.
2. `FileUpload`: Handles file drag-and-drop functionality using react-dropzone and includes the ThresholdForm component.
3. `ThresholdForm`: Provides a form for users to input threshold parameters (lead time, safety stock percentage, and average daily sales).
4. `InventoryChart`: Visualizes the historical inventory data and calculated thresholds using recharts.
5. `ThresholdExport`: Displays the calculated thresholds in a formatted way.

#### Threshold Calculation Algorithm

The threshold calculation algorithm is implemented in the `calculateThresholds` function on the server-side. Here's how it works:

1. **Input**:

   1. Historical inventory data (file)
   2. Lead time (user-provided)
   3. Safety stock percentage (user-provided)
   4. Average daily sales (user-provided)

2. **Calculation Steps**:
   a. Calculate order frequency:

   1. Filter orders with quantity > 0
   2. Calculate intervals between order dates
   3. Compute average interval (default to 7 days if no data)

   b. Calculate average fulfillment time from historical data

   c. Calculate thresholds:

   1. Low = Average Daily Sales \* (Lead Time + Average Fulfillment Time)
   2. Medium = Low + (Low \* Safety Stock Percentage)
   3. High = Medium \* (1 + Average Order Frequency / 30)

3. **Output**: Object with low, medium, and high threshold values

This algorithm considers both user-provided parameters and historical data to provide dynamic, data-driven threshold recommendations.

#### Setup Instructions

1. Clone the repository to your local machine.

2. Install dependencies:

```plaintext
npm install
```

3. Run the development server:

```plaintext
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.
5. To use the application:

   1. Upload a CSV file with inventory data (format: product_id, product_name, date, inventory_level, orders, lead_time_days)
   2. Enter threshold parameters (lead time, safety stock percentage, average daily sales)
   3. Click "Calculate Thresholds" to view the results

6. For production deployment, build the application:

```plaintext
npm run build
```

Then start the production server:

```plaintext
npm start
```
