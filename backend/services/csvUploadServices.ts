import fs from "fs";
import csvParser from "csv-parser";
import { SalesRecord, AggregatedSales } from "../utils/types";
import path from "path";
export async function processCsvFile(
  filePath: string
): Promise<AggregatedSales> {
  return new Promise((resolve, reject) => {
    const aggregatedData: AggregatedSales = {};

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (row: SalesRecord) => {
        console.log("Parsed row:", row); // Debug log
        const department = row.DepartmentName;
        const sales = row.NumberOfSales
          ? parseInt(row.NumberOfSales.toString(), 10)
          : 0;
        if (department && !isNaN(sales)) {
          aggregatedData[department] =
            (aggregatedData[department] || 0) + sales;
        }
      })
      .on("end", () => resolve(aggregatedData))
      .on("error", (error) => reject(error));
  });
}

export async function processSalesData(
  filePath: string,
  outputPath: string
): Promise<AggregatedSales> {
  // Ensure output directory exists
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  // Process CSV
  const aggregatedData = await processCsvFile(filePath);

  // Write results to CSV
  const writeStream = fs.createWriteStream(outputPath);
  writeStream.write("DepartmentName,TotalNumberOfSales\n");
  Object.entries(aggregatedData).forEach(([dept, sales]) => {
    writeStream.write(`${dept},${sales}\n`);
  });
  writeStream.end();
  console.log(aggregatedData);

  // Clean up uploaded file
  fs.unlinkSync(filePath);
  return aggregatedData;
}
