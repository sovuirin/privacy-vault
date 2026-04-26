const ExifReader = require('exifreader');
const fs = require('fs');

async function check() {
  const fileBuffer = fs.readFileSync('forensic_test.jpg');
  const tags = ExifReader.load(fileBuffer);
  console.log("GPS Latitude:", tags['GPSLatitude']?.description);
  console.log("Make:", tags['Make']?.description);
  console.log("Model:", tags['Model']?.description);
  console.log("DateTime:", tags['DateTimeOriginal']?.description);
}

check();
