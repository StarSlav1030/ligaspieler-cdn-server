import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

// __dirname workaround for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CONFIG
const inputDir = path.join(__dirname, "nations");
const outputDir = path.join(inputDir, "28x28");
const size = 28;

async function resizeImages() {
  try {
    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Read all PNG files
    const files = await fs.readdir(inputDir);
    const pngFiles = files.filter((f) => f.toLowerCase().endsWith(".png"));

    for (const file of pngFiles) {
      const inputPath = path.join(inputDir, file);
      const outputPath = path.join(outputDir, file);

      await sharp(inputPath).resize(size, size).toFile(outputPath);

      console.log(`✅ Resized: ${file}`);
    }

    console.log(`\nAll images resized to ${size}x${size}px in: ${outputDir}`);
  } catch (err) {
    console.error("❌ Error processing images:", err);
  }
}

resizeImages();
