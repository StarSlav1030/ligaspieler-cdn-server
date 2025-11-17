import fs from "fs";
import path from "path";
import sharp from "sharp";

/**
 * Converts all SVG files from input folder to PNG files in output folder.
 * @param {string} inputDir  - folder containing .svg files
 * @param {string} outputDir - folder where PNGs will be saved
 * @param {number} size      - width/height in px (optional)
 */
const inputDir = "./clubs-svg";
const outputDir = "./clubs-png";
const size = 512;
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".svg"));

for (const file of files) {
  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file.replace(".svg", ".png"));

  console.log(`→ Converting ${file} ...`);

  await sharp(inputPath)
    //   .resize(size, size, { fit: "contain" })
    .png()
    .toFile(outputPath);
}

console.log("✅ All SVGs converted to PNG!");
