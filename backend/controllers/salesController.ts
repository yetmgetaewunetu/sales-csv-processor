import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { Worker } from "worker_threads";
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
    const outputPath = path.join(process.cwd(), "output", `${fileId}.csv`);

    // Create a new worker
    const worker = new Worker(
      path.join(process.cwd(), "workers", "csvProcessor.js"),
      {
        workerData: { filePath: req.file.path, outputPath },
      }
    );

    // Handle worker messages
    worker.on("message", (result) => {
      if (result.success) {
        // const downloadUrl = `http://localhost:${PORT}/output/${fileId}.csv`;
        const downloadUrl = `https://sales-csv-processor-backend.onrender.com/output/${fileId}.csv`;
        const response: UploadResponse = {
          fileId,
          downloadUrl,
        };
        res.json({ ...response, aggregatedData: result.data });
      } else {
        res.status(500).json({ error: result.error });
      }
    });

    // Handle worker errors
    worker.on("error", (error) => {
      console.error("Worker error:", error);
      res.status(500).json({ error: "Failed to process file" });
    });

    // Handle worker exit
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.error(`Worker stopped with exit code ${code}`);
      }
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
