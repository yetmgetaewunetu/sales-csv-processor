import fs from "fs";
import csvParser from "csv-parser";
import { SalesRecord, AggregatedSales } from "../utils/types";
import path from "path";

export async function processCsvFile(
  filePath: string
): Promise<AggregatedSales> {
  return new Promise((resolve, reject) => {
    const aggregatedData: AggregatedSales = {};
    let rowCount = 0;

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: any) => {
        rowCount++;
        console.log(`Processing row ${rowCount}:`, row);
        
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
        console.log(`Updated total for ${department}: ${aggregatedData[department]}`);
      })
      .on("end", () => {
        console.log(`Finished processing ${rowCount} rows`);
        console.log('Final aggregated data:', aggregatedData);
        resolve(aggregatedData);
      })
      .on("error", (error) => {
        console.error('Error processing CSV:', error);
        reject(error);
      });
  });
}

export async function processSalesData(
  filePath: string,
  outputPath: string
): Promise<AggregatedSales> {
  try {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Processing file:', filePath);
    console.log('Output path:', outputPath);

    // Process CSV
    const aggregatedData = await processCsvFile(filePath);
    console.log('Aggregated data:', aggregatedData);

    // Write results to CSV
    const writeStream = fs.createWriteStream(outputPath);
    writeStream.write("DepartmentName,TotalNumberOfSales\n");
    
    Object.entries(aggregatedData).forEach(([dept, sales]) => {
      const line = `${dept},${sales}\n`;
      console.log('Writing line:', line.trim());
      writeStream.write(line);
    });
    
    writeStream.end();

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    
    return aggregatedData;
  } catch (error) {
    console.error('Error in processSalesData:', error);
    throw error;
  }
}
