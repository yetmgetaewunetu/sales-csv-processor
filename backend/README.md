# CSV Processor Backend

A simple backend service that processes CSV files containing sales data. It uses worker threads for efficient file processing.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
PORT=5500
UPLOAD_DIR=uploads
```

3. Start the server:
```bash
npm run dev
```

## API Endpoints

### Upload CSV File
```
POST /upload
```
Uploads and processes a CSV file.

**Request:**
- Content-Type: multipart/form-data
- Body: file (CSV file)

**Response:**
```json
{
  "downloadUrl": "string",
  "aggregatedData": {
    "department1": number,
    "department2": number
  },
  "metrics": {
    "totalRows": number,
    "uniqueDepartments": number,
    "processingTimeMs": number
  }
}
```

## File Structure

```
backend/
├── controllers/     # Request handlers
├── services/       # Business logic
├── workers/        # File processing workers
├── uploads/        # Temporary file storage
└── server.js       # Main application file
```

## How It Works

1. File Upload:
   - Receives CSV file
   - Saves to temporary storage
   - Creates a worker thread

2. File Processing:
   - Worker reads CSV file
   - Calculates department totals
   - Generates processed file

3. Response:
   - Returns download URL
   - Includes processing metrics
   - Includes aggregated data

## Error Handling

- Invalid file format
- Missing required columns
- File processing errors
- Server errors

## Tech Stack

- Node.js
- Express
- Worker Threads
- CSV Parser 