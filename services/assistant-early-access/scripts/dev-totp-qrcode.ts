import * as qrcode from "qrcode";
import * as path from "path";
import { promises as fs } from "fs";

async function make(name: string, data: string) {
  // Generate QR code data URL
  const url = await qrcode.toDataURL(data, { errorCorrectionLevel: "H" });

  // Strip data URL header and convert to buffer
  const buffer = Buffer.from(url.split(",")[1], "base64");

  // Write buffer to file
  await fs.writeFile(path.join(__dirname, `./out/${name}.png`), buffer);

  console.log(`QR code saved as ./out/${name}.png`);
}

async function main() {
  const seed = JSON.parse(
    await fs.readFile(path.join(__dirname, `./out/seed.json`), "utf-8")
  );

  seed.map(({ name, data }, i) => {
    //
    make(`${i + 1}-${name}`, data);
  });
}

// if main
if (require.main === module) {
  main();
}
