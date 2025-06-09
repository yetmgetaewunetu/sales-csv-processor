import express from "express";
import { uploadFile } from "../controllers/salesController";
import multer from "multer";
import fs from "fs";
import path from "path";

// Ensure uploads directory exists
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir }); // Use relative path for uploads
const router = express.Router();

// attached the file and sent it to the controller in the request
router.post("/upload", upload.single("file"), uploadFile);

export default router;
