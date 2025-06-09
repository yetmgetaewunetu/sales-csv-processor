import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { processSalesData } from "../services/csvUploadServices";
import { UploadResponse } from "../utils/types";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PORT = 5500;

interface FileRequest extends Request {
  file?: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
  };
}

// Controller for handling CSV file uploads and processing
export const uploadSalesData = async (req: Request, res: Response) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("Processing file:", req.file.originalname);

    // Process the uploaded file
    const result = await processSalesData(req.file.path);

    // Send success response with results
    res.json({
      downloadUrl: result.downloadUrl,
      aggregatedData: result.aggregatedData,
      metrics: result.metrics
    });
  } catch (error) {
    console.error("Error processing file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};

export async function uploadFile(req: FileRequest, res: Response): Promise<void> {
  try {
    console.log("Upload request received");
    console.log("Request file:", req.file);
    
    if (!req.file) {
      console.log("No file in request");
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    const fileId = uuidv4();
    console.log("Generated file ID:", fileId);
    
    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      console.log("Creating output directory");
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, `${fileId}.csv`);
    console.log("Output path:", outputPath);

    // Processing the file and get aggregated data
    console.log("Starting file processing");
    const result = await processSalesData(req.file.path, outputPath);
    console.log("File processing completed");
    console.log("Result:", result);

    if (!result.success) {
      throw new Error(result.error || "Processing failed");
    }


    // the downloadable url for the output file
    const downloadUrl = `http://localhost:5500/output/${fileId}.csv`;
    console.log("Generated download URL:", downloadUrl);

    const response: UploadResponse = {
      fileId,
      downloadUrl,
      aggregatedData: result.aggregatedData,
      metrics: result.metrics
    };

    console.log("Sending response");
    res.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    res.status(500).json({ error: "Internal server error" });
  }
}
