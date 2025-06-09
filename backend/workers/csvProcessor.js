import { parentPort } from 'worker_threads';
import fs from 'fs';
import csvParser from 'csv-parser';
import path from 'path';

// Listen for messages from the main thread
parentPort.on('message', async (data) => {
  try {
    const { filePath, outputPath } = data;
    const aggregatedData = await processCsvFile(filePath);
    
    // Write results to CSV
    const writeStream = fs.createWriteStream(outputPath);
    writeStream.write("DepartmentName,TotalNumberOfSales\n");
    Object.entries(aggregatedData).forEach(([dept, sales]) => {
      writeStream.write(`${dept},${sales}\n`);
    });
    writeStream.end();

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Send the result back to the main thread
    parentPort.postMessage({ 
      success: true, 
      data: aggregatedData 
    });
  } catch (error) {
    parentPort.postMessage({ 
      success: false, 
      error: error.message 
    });
  }
});

async function processCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const aggregatedData = {};
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row) => {
        rowCount++;
        // Handle both formats of column names
        const department = row['Department Name'] || row.DepartmentName;
        const sales = row['Number of Sales'] || row.NumberOfSales;
        
        const salesNumber = sales ? parseInt(sales.toString(), 10) : 0;

        if (!department) {
          console.warn(`Row ${rowCount}: Missing department name`);
          return;
        }

        if (isNaN(salesNumber)) {
          console.warn(`Row ${rowCount}: Invalid sales number for ${department}`);
          return;
        }

        aggregatedData[department] = (aggregatedData[department] || 0) + salesNumber;
      })
      .on("end", () => {
        console.log(`Finished processing ${rowCount} rows`);
        resolve(aggregatedData);
      })
      .on("error", (error) => {
        console.error('Error processing CSV:', error);
        reject(error);
      });
  });
} 