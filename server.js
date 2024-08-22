const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const os = require("os");
const http = require("http");

const app = express();

// Determine if the script is running as a packaged binary or via Node.js
const isPackaged = process.pkg !== undefined;

// Set the 'www' directory
const uploadDir = isPackaged
  ? path.join(path.dirname(process.execPath), "www") // Running as a packaged binary
  : path.join(__dirname, "www"); // Running in a standard Node.js environment
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Created directory: ${uploadDir}`);
} else {
  console.log(`Directory already exists: ${uploadDir}`);
}

// Configure multer storage to preserve original filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Preserve the original filename
  },
});

const upload = multer({ storage: storage }); // Use the customized storage

// Function to get the local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1"; // Fallback to localhost if no IP found
}

// Route for uploading files
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.log("No file uploaded.");
    return res.status(400).send("No file uploaded.");
  }
  console.log(`File uploaded: ${req.file.originalname} to ${uploadDir}`);
  res.send(`File uploaded successfully: ${req.file.originalname}`);
});

// Route for downloading files from the root
app.get("/:filename", (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);

  if (fs.existsSync(filePath)) {
    console.log(`File requested for download: ${req.params.filename}`);
    res.download(filePath);
  } else {
    console.log(`File not found: ${req.params.filename}`);
    res.status(404).send("File not found.");
  }
});

// Function to start the server on the desired port or fallback to a random port
function startServer(port) {
  const server = app.listen(port, () => {
    const ipAddress = getLocalIpAddress();
    const actualPort = server.address().port;
    console.log(`\nServer is running on http://${ipAddress}:${actualPort}`);
    console.log(`\nExample curl command to upload a file:`);
    console.log(
      `curl -X POST http://${ipAddress}:${actualPort}/upload -F 'file=@./myfile.tar'`
    );
    console.log(`\nExample wget command to download the file:`);
    console.log(`wget http://${ipAddress}:${actualPort}/myfile.tar`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(
        `Port ${port} is already in use. Trying a random unused port...`
      );
      startServer(0); // Use port 0 to let the system assign an available port
    } else {
      console.error(`Server error: ${err.message}`);
    }
  });
}

// Start the server on port 1337 or fallback if it's in use
startServer(1337);
