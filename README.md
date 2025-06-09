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

### Backend Setup
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

### Frontend Setup
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

<h1>
  Project Title: CSV file SalesData Hanlding web app 
</h1> 

This Project is a Fullstack web app. Let's see both backend and frontend implementation.

<h2>Backend</h2>
the backend accepts a csv file containing department, date and Number of Sales from different department and saves in the server. it then returns a department name and aggregate sale.
it groups the department from the csv file and returns the aggregate sum for each department. 
you can check the live backend here <a href="https://sales-csv-processor-backend.onrender.com" target="_blank">here</a>

the requirements are the following

system Requirement:
      Your system must:
      - Accept CSV file uploads via an HTTP POST endpoint (/upload)
      - Aggregate total number of sales per department
      - Write results to a new CSV file with two columns:
          - Department Name
          - Total Number of Sales
      - Return a downloadable link to the result file in the response

Constraints & Requirements
- Use Node.js + Express.js as the backend framework
- Process very large CSV files that cannot fit in memory
- Use streaming (e.g., csv-parser, fs)
- Ensure the solution is modular, scalable, and testable
- Write clean, documented, and typed code (use TypeScript)
- Use UUIDs or hashes for naming output files

<h2>FrontEnd</h2>
I used Reac.js + vite for the frontend. the frontend is a simple upload component. the user uploads a csv file containing the salesdata. 
after submitting it the backend will respond a download link so that the user can download the processed data as a csv file.

I used axios for api requests and the app is build using serve module on render.com.

live demo <a href="https://sales-csv-processor-frontend.onrender.com" target="_blanck"> here </a>

the requiremts were the following
- Upload a CSV file
- See a progress indicator
- View and download the processed result file

Use either:
- React (Vite or Create React App)
- Next.js (App Router preferred)

Ensure the frontend and backend communicate effectively (e.g., using axios).

this is a simple file upload ui as requested in the assignment description
![image](https://github.com/user-attachments/assets/8e5697e7-b44c-4a8d-8483-840b1cadd29e)
the we select a file or drag it to the input area
![image](https://github.com/user-attachments/assets/7c931d7f-6763-43cc-b9f2-0d6e96d6ac4b)
when a file is selected it shows preview of the file and activates the process button
![image](https://github.com/user-attachments/assets/a7470f58-5fc7-45a5-8872-105b73efe891)
after processing the file there will be a button to download the processed csv file
![image](https://github.com/user-attachments/assets/8402acd0-0b44-4d4f-aa40-45d82c3633db)
when we click the download button it will automatically download the processed csv file to our local machine
![image](https://github.com/user-attachments/assets/e00c21ad-abba-4708-bf60-1f97fb72a190)
the last process input will look like this <br />
![image](https://github.com/user-attachments/assets/2fa325cf-b87c-4812-a7a3-0c192a60b081)

<br /> <br />
<hr />
<h5>by: Yetmgeta Ewunetu</h5>
<p>I appreciate any comments</p>
Thankyou!
