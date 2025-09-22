import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ extended: true, limit: "500mb" }));

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "OK", message: "Server is running" });
});

app.get("/api/config", (req: Request, res: Response) => {
  res.json({
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api", apiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === "production") {
  const distDir = path.join(__dirname, "../dist");
  const indexHtml = path.join(distDir, "index.html");
  if (fs.existsSync(indexHtml)) {
    app.use(express.static(distDir));
    app.get("/*", (req: Request, res: Response) => {
      res.sendFile(indexHtml);
    });
  } else {
    app.get("/", (req: Request, res: Response) => {
      res.json({ status: "OK", message: "API is running" });
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
