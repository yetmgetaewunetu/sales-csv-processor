import fs from "fs";
import csvParser from "csv-parser";
import { SalesRecord, AggregatedSales } from "../utils/types";
import path from "path";
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { parentPort } from "worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Service for handling CSV file processing
interface ProcessingResult {
  success: boolean;
  error?: string;
  downloadUrl?: string;
  aggregatedData?: Record<string, number>;
  metrics?: {
    totalRows: number;
    uniqueDepartments: number;
    processingTimeMs: number;
  };
}

interface WorkerData {
  inputPath: string;
  outputPath: string;
}

interface CSVRow {
  'Department Name'?: string;
  DepartmentName?: string;
  'Number of Sales'?: string | number;
  NumberOfSales?: string | number;
}

const workerCode = `
const { parentPort } = require('worker_threads');
const fs = require('fs');
const csvParser = require('csv-parser');

parentPort.on('message', async (data) => {
  const startTime = process.hrtime();
  try {
    const { inputPath, outputPath } = data;
    console.log("Worker received data:", { inputPath, outputPath });
    
    const aggregatedData = {};
    let rowCount = 0;
    let departmentCount = new Set();

    // Process CSV in chunks
    await new Promise((resolve, reject) => {
      console.log("Starting CSV processing");
      fs.createReadStream(inputPath)
        .pipe(csvParser())
        .on('data', (row) => {
          rowCount++;
          // Handle both formats of column names
          const department = row['Department Name'] || row.DepartmentName;
          const sales = row['Number of Sales'] || row.NumberOfSales;
          
          const salesNumber = sales ? parseInt(sales.toString(), 10) : 0;

          if (department && !isNaN(salesNumber)) {
            aggregatedData[department] = (aggregatedData[department] || 0) + salesNumber;
            departmentCount.add(department);
          }
        })
        .on('end', () => {
          console.log("CSV processing completed");
  // Write results to CSV
  const writeStream = fs.createWriteStream(outputPath);
          writeStream.write("DepartmentName,TotalNumberOfSales\\n");
          
  Object.entries(aggregatedData).forEach(([dept, sales]) => {
            writeStream.write(\`\${dept},\${sales}\\n\`);
  });
          
  writeStream.end();
          resolve();
        })
        .on('error', (error) => {
          console.error("CSV processing error:", error);
          reject(error);
        });
    });

    // Clean up uploaded file
    fs.unlinkSync(inputPath);

    // Calculate processing time
    const [seconds, nanoseconds] = process.hrtime(startTime);
    const processingTime = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    console.log("Sending results back to main thread");
    // Send result back to main thread with metrics
    parentPort.postMessage({ 
      success: true, 
      aggregatedData,
      metrics: {
        processingTimeMs: processingTime,
        totalRows: rowCount,
        uniqueDepartments: departmentCount.size,
        departments: Array.from(departmentCount)
      }
    });
  } catch (error) {
    console.error("Worker error:", error);
    parentPort.postMessage({ 
      success: false, 
      error: error.message 
    });
  }
});
`;

// Process the uploaded CSV file
export const processSalesData = async (filePath: string): Promise<ProcessingResult> => {
  const startTime = Date.now();

  try {
    // Create a worker to process the file
    const worker = new Worker(`
      const { parentPort } = require('worker_threads');
      const fs = require('fs');
      const csv = require('csv-parse');

      parentPort.on('message', async (data) => {
        try {
          const { filePath } = data;
          const fileContent = fs.readFileSync(filePath, 'utf-8');
          const departments = new Map();
          let totalRows = 0;

          // Process CSV data
          const parser = csv.parse({
            columns: true,
            skip_empty_lines: true
          });

          parser.on('readable', () => {
            let record;
            while ((record = parser.read())) {
              totalRows++;
              const dept = record.Department;
              const amount = parseFloat(record['Sales Amount']);
              
              if (!isNaN(amount)) {
                departments.set(dept, (departments.get(dept) || 0) + amount);
              }
            }
          });

          parser.on('end', () => {
            // Send results back to main thread
            parentPort.postMessage({
              success: true,
              aggregatedData: Object.fromEntries(departments),
              metrics: {
                totalRows,
                uniqueDepartments: departments.size,
                processingTimeMs: Date.now() - startTime
              }
            });
          });

          parser.write(fileContent);
          parser.end();
        } catch (error) {
          parentPort.postMessage({
            success: false,
            error: error.message
          });
        }
      });
    `, { eval: true });

    // Send file path to worker
    worker.postMessage({ filePath });

    // Wait for worker to complete
    return new Promise((resolve, reject) => {
      worker.on('message', (result) => {
        if (result.success) {
          // Generate download URL
          const downloadUrl = `/download/${path.basename(filePath)}`;
          
          resolve({
            success: true,
            downloadUrl,
            aggregatedData: result.aggregatedData,
            metrics: result.metrics
          });
        } else {
          reject(new Error(result.error));
        }
      });

      worker.on('error', (error) => {
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  } catch (error) {
    console.error("Error in processSalesData:", error);
    return {
      success: false,
      error: error.message
    };
  } finally {
    // Clean up temporary file
    try {
  fs.unlinkSync(filePath);
    } catch (error) {
      console.error("Error deleting temporary file:", error);
    }
}
};
