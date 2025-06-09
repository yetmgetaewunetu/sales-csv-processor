# Sales CSV Processor

A full-stack application for processing sales data from CSV files, featuring real-time data validation, progress tracking, and efficient data processing.

## Features

- CSV file upload with drag-and-drop support
- Real-time file validation and preview
- Progress tracking during upload
- Efficient data processing with memory optimization
- Department-wise sales aggregation
- Detailed processing metrics
- Download processed results

## How to Run the App

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Quick Start (Recommended)
1. Clone the repository:
```bash
git clone <repository-url>
cd sales-csv-processor
```

2. Install all dependencies (root, frontend, and backend):
```bash
npm run install:all
```

3. Start both frontend and backend servers:
```bash
npm run start
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5500

### Alternative Setup (Individual Components)

#### Backend Setup
1. Navigate to the backend directory:
```bash
cd sales-csv-processor/backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```
The backend server will run on http://localhost:5500

#### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd sales-csv-processor/frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
The frontend will be available at http://localhost:5173

### Available Scripts

From the root directory, you can use the following commands:

- `npm run install:all` - Install all dependencies
- `npm run dev` - Run both frontend and backend in development mode
- `npm run build` - Build both frontend and backend

Individual component scripts:
- Frontend: `npm run dev:frontend`, `npm run build:frontend`
- Backend: `npm run dev:backend`, `npm run build:backend`

## Algorithm Explanation

### Data Processing Strategy

The application uses a streaming approach to process CSV files efficiently:

1. **Chunked Reading**: 
   - Files are read in chunks rather than loading the entire file into memory
   - Each chunk is processed independently
   - This allows handling of large files without memory issues

2. **Memory Efficiency**:
   - Uses Node.js streams for file processing
   - Implements a sliding window approach for data processing
   - Maintains only necessary data in memory
   - Aggregates data on-the-fly instead of storing all records

3. **Data Validation**:
   - Real-time validation of each row
   - Immediate error detection and reporting
   - Skips invalid rows without stopping the entire process

4. **Aggregation Strategy**:
   - Uses a Map data structure for department-wise aggregation
   - Updates totals incrementally as data is processed
   - Maintains running totals instead of storing all transactions

## Time and Space Complexity

### Time Complexity
- File Reading: O(n) where n is the number of bytes in the file
- CSV Parsing: O(n) where n is the number of rows
- Data Processing: O(n) where n is the number of valid rows
- Aggregation: O(1) per row (constant time for Map operations)
- Overall Complexity: O(n) where n is the number of rows in the CSV

### Space Complexity
- File Reading: O(chunk_size) where chunk_size is the size of each processing chunk
- Data Processing: O(d) where d is the number of unique departments
- Aggregation: O(d) where d is the number of unique departments
- Overall Complexity: O(d) where d is the number of unique departments

The space complexity is optimized to be independent of the input size, making it suitable for processing large files with limited memory resources.

## Error Handling

The application implements comprehensive error handling:
- File format validation
- Data type checking
- Missing value handling
- Invalid data skipping
- Detailed error reporting

## Performance Considerations

- Chunk size is optimized for memory usage vs processing speed
- Uses efficient data structures for aggregation
- Implements early termination for invalid files
- Provides real-time progress updates
- Maintains processing metrics for optimization

<hr />
<h5>by: Yetmgeta Ewunetu</h5>
<p>I appreciate any comments</p>
Thankyou!
