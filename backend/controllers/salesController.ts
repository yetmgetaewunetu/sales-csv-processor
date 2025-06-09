import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { processSalesData } from "../services/csvUploadServices";
import { UploadResponse } from "../utils/types";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    console.log("upload requested");
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileId = uuidv4();
    const outputPath = path.resolve("output", `${fileId}.csv`); // Use path.resolve for output

    // Process the file and get aggregated data
    const aggregatedData = await processSalesData(req.file.path, outputPath);

    // Generate download URL
    const downloadUrl = `https://sales-csv-processor-backend.onrender.com/output/${fileId}.csv`;

    const response: UploadResponse = {
      fileId,
      downloadUrl,
    };

    res.json({ ...response, aggregatedData });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
