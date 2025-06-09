import { parentPort } from 'worker_threads';
import fs from 'fs';
import csvParser from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
          writeStream.write("DepartmentName,TotalNumberOfSales\n");
          
          Object.entries(aggregatedData).forEach(([dept, sales]) => {
            writeStream.write(`${dept},${sales}\n`);
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