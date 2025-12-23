import express from "express";
import path from "path";
import compression from "compression";
import { fileURLToPath } from "url";
import cors from "cors";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Enable compression
app.use(compression());

// CORS
app.use(cors({ origin: "*" }));

// Serve images
app.use(
  express.static(__dirname, {
    extensions: ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"],
    maxAge: "7d",
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      if (/[.-][0-9a-f]{6,}\.(png|jpe?g|webp|avif|gif|svg)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    },
  })
);

// 🔁 Image fallback (IMPORTANT: must be AFTER express.static)
app.use((req, res, next) => {
  const ext = path.extname(req.path).toLowerCase();

  const isImage = [".png", ".jpg", ".jpeg", ".webp", ".avif", ".gif", ".svg"].includes(ext);

  if (!isImage) return next();

  const fallbackPath = path.join(__dirname, "categories", `temp${ext}`);

  if (fs.existsSync(fallbackPath)) {
    res.sendFile(fallbackPath);
  } else {
    res.status(404).send("Fallback image missing");
  }
});

app.get("/", (req, res) => {
  res.send("Root Image Server Running");
});

app.listen(PORT, () => console.log(`🔥 Image server running at http://localhost:${PORT}`));
