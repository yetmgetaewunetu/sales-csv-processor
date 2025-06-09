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
