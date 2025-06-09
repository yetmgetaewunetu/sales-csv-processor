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
    origin: ["https://sales-csv-processor-frontend.onrender.com"],
  })
);
const port = process.env.PORT;

//output folder will be used for static files(csv created)
app.use("/output", express.static(path.resolve("output")));
app.use("/", csvRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log("failed to start server");
  } else {
    console.log(`Server running on port: ${port}`);
  }
});
