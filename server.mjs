// server.mjs
import express from "express";
import path from "path";
import compression from "compression";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8000;

// Enable compression for text-based responses
app.use(compression());

// Serve ONLY image files from root directory
app.use(
  cors({ origin: "*" }),
  express.static(__dirname, {
    extensions: ["png", "jpg", "jpeg", "webp", "avif", "gif", "svg"],
    maxAge: "7d",
    etag: true,
    lastModified: true,
    setHeaders(res, filePath) {
      // Cache long for hashed filenames (optional)
      if (/[.-][0-9a-f]{6,}\.(png|jpe?g|webp|avif|gif|svg)$/i.test(filePath)) {
        res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      } else {
        // Normal cache
        res.setHeader("Cache-Control", "public, max-age=604800");
      }
    },
  })
);

app.get("/", (req, res) => {
  res.send("Root Image Server Running");
});

app.listen(PORT, () => console.log(`🔥 Image server running at http://localhost:${PORT}`));
