import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT;
// Middleware to enable CORS
app.use(
  cors({
    origin: process.env.FRONT_END_URL, // Allow access from your frontend
  })
);

// Middleware to parse JSON bodies
app.use(bodyParser.json({ limit: "10mb" }));
// Serve static files from the 'dist' folder
app.use(express.static(path.join(__dirname, "dist")));

// Serve static files from the uploads directory
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Endpoint to upload the certificate
app.post("/api/upload-certificate", (req, res) => {
  const imgData = req.body.image;

  // Extract the base64 part
  const base64Data = imgData.replace(/^data:image\/jpeg;base64,/, "");

  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }

  // Generate a unique filename
  const fileName = `certificate-${Date.now()}.jpg`;
  const filePath = path.join(uploadsDir, fileName);

  // Write the file
  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) {
      console.error("Error saving the image:", err);
      return res.status(500).send("Error saving the image");
    }

    // Send back the file path
    const fileUrl = `https://${req.get("host")}/uploads/${fileName}`;
    res.json({ filePath: fileUrl });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
