import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { processSalesData } from "../services/csvUploadServices";
import { UploadResponse } from "../utils/types";
import dotenv from "dotenv";

dotenv.config();

const PORT = 5500; // Hardcoding the port since we know it's running on 5500

export async function uploadFile(req: Request, res: Response): Promise<void> {
  try {
    console.log("upload requested");
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileId = uuidv4();
    // i will use this path for storing the outupt data, some demo is availabe on the github rep /backend/outputs
    const outputPath = path.join(process.cwd(), "output", `${fileId}.csv`);

    // Processing the file and get aggregated data
    const aggregatedData = await processSalesData(req.file.path, outputPath);

    // Generate download URL
    const downloadUrl = `https://sales-csv-processor-backend.onrender.com/output/${fileId}.csv`;

    const response: UploadResponse = {
      fileId,
      downloadUrl,
    };

    res.json({ ...response, aggregatedData });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
