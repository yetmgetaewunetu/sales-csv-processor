import express from "express";
import csvRoutes from "./routes/salesRoutes";
import * as dotenv from "dotenv";
import process from "node:process";
import path from "node:path";
import cors from "cors";

const app = express();
dotenv.config();
app.use(express.json());
app.use(
  cors({
    origin: ["https://sales-csv-processor-frontend.onrender.com", "http://localhost:5173", "http://localhost:5500"],
  })
);

//output folder will be used for static files(csv created)
const outputPath = path.join(process.cwd(), "output");
app.use("/output", express.static(outputPath));
app.use("/", csvRoutes);

const port = 5500; // Hardcoding the port since we know it's running on 5500

app.listen(port, (err) => {
  if (err) {
    console.log("failed to start server");
  } else {
    console.log(`Server running on port: ${port}`);
    console.log(`Static files being served from: ${outputPath}`);
  }
});
