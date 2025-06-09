# CSV Sales Data Processor

A web application that processes CSV files containing sales data using worker threads for efficient processing.

## Running the Application

1. Install dependencies:
```bash
npm install
npm run install:all
```

2. Start the development servers:
```bash
npm run dev
```

This will start:
- Frontend on http://localhost:5173
- Backend on http://localhost:5500

## Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd backend
npm test
```

## Algorithm & Memory Efficiency

### Processing Strategy
1. **Streaming Processing**
   - CSV files are processed line by line using streams
   - Prevents loading entire file into memory
   - Enables handling of large files efficiently

2. **Worker Thread Implementation**
   - Processing is offloaded to a separate worker thread
   - Main thread remains responsive for handling user requests
   - Worker thread handles:
     - CSV parsing
     - Data aggregation
     - Error handling

3. **Memory Management**
   - Uses Node.js streams for file reading
   - Processes data in chunks
   - Aggregates results incrementally
   - Cleans up temporary files after processing

### Big O Complexity Analysis

1. **Time Complexity**
   - File Reading: O(n) where n is the number of lines
   - CSV Parsing: O(n) for each line
   - Data Aggregation: O(1) per line (using hash map)
   - Overall: O(n) where n is the number of lines in the CSV

2. **Space Complexity**
   - File Reading: O(1) - constant memory for stream buffer
   - Data Storage: O(d) where d is the number of unique departments
   - Worker Thread: O(1) - constant overhead for thread creation
   - Overall: O(d) where d is the number of unique departments

### Memory Efficiency Features
1. **Streaming Processing**
   - Files are read in chunks
   - Memory usage remains constant regardless of file size
   - Enables processing of files larger than available RAM

2. **Incremental Aggregation**
   - Results are aggregated as data is processed
   - No need to store entire dataset in memory
   - Memory usage scales with unique departments, not total rows

3. **Resource Cleanup**
   - Temporary files are deleted after processing
   - Worker threads are terminated after completion
   - Memory is freed after each processing job

## File Format

Expected CSV format:
```csv
date,department,amount
2024-01-01,Electronics,1000.50
2024-01-01,Clothing,750.25
```

## Tech Stack

- Frontend: React, Tailwind CSS
- Backend: Node.js, Express
- Processing: Node.js Worker Threads
- File Handling: Node.js Streams


<hr />
<h5>by: Yetmgeta Ewunetu</h5>
<p>I appreciate any comments</p>
Thankyou!
