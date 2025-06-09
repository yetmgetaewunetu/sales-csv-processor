import fs from "fs";
import csvParser from "csv-parser";
import { SalesRecord, AggregatedSales } from "../utils/types";
import path from "path";
import { Worker } from 'worker_threads';
import { fileURLToPath } from 'url';
import { parentPort } from "worker_threads";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProcessingResult {
  success: boolean;
  error?: string;
  aggregatedData: Record<string, number>;
  metrics: {
    processingTimeMs: number;
    totalRows: number;
    uniqueDepartments: number;
    departments: string[];
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

export async function processSalesData(inputPath: string, outputPath: string): Promise<ProcessingResult> {
  console.log("Starting processSalesData");
  console.log("Input path:", inputPath);
  console.log("Output path:", outputPath);

  return new Promise((resolve, reject) => {
    const startTime = process.hrtime();

    try {
      const worker = new Worker(workerCode, { 
        eval: true,
        workerData: { inputPath, outputPath } as WorkerData
      });

      console.log("Worker created");

      worker.on("message", (result: ProcessingResult) => {
        console.log("Received message from worker:", result);
        if (!result.success) {
          reject(new Error(result.error || "Worker processing failed"));
          return;
        }

        const [seconds, nanoseconds] = process.hrtime(startTime);
        const processingTimeMs = seconds * 1000 + nanoseconds / 1000000;
        
        resolve({
          ...result,
          metrics: {
            ...result.metrics,
            processingTimeMs
          }
        });
      });

      worker.on("error", (error) => {
        console.error("Worker error:", error);
        reject(error);
      });

      worker.on("exit", (code) => {
        console.log("Worker exited with code:", code);
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });

      console.log("Worker event listeners attached");
      worker.postMessage({ inputPath, outputPath });
    } catch (error) {
      console.error("Error creating worker:", error);
      reject(error);
    }
  });
}
