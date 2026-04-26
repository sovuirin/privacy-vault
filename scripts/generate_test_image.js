const fs = require('fs');
const piexif = require('piexifjs');

// Create a small blank JPEG buffer
// A 1x1 black pixel JPEG
const base64Jpeg = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAAAP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AVf/Z";
const jpegData = Buffer.from(base64Jpeg, 'base64');

const zeroth = {};
const exif = {};
const gps = {};

// Add some high-risk metadata
zeroth[piexif.ImageIFD.Make] = "Sovereign Optics";
zeroth[piexif.ImageIFD.Model] = "Sanctuary-X1";
zeroth[piexif.ImageIFD.Software] = "Forensic-Suite-v5";
zeroth[piexif.ImageIFD.DateTime] = "2026:04:26 12:34:56";

exif[piexif.ExifIFD.DateTimeOriginal] = "2026:04:26 12:34:56";
exif[piexif.ExifIFD.BodySerialNumber] = "SN-987654321-VAULT";
exif[piexif.ExifIFD.LensModel] = "Privacy-Prime-35mm";

// GPS Data (London)
gps[piexif.GPSIFD.GPSLatitudeRef] = "N";
gps[piexif.GPSIFD.GPSLatitude] = [[51, 1], [30, 1], [30, 1]];
gps[piexif.GPSIFD.GPSLongitudeRef] = "W";
gps[piexif.GPSIFD.GPSLongitude] = [[0, 1], [7, 1], [32, 1]];

const exifObj = {"0th": zeroth, "Exif": exif, "GPS": gps};
const exifBytes = piexif.dump(exifObj);

const newJpegData = piexif.insert(exifBytes, jpegData.toString('binary'));
const buffer = Buffer.from(newJpegData, 'binary');

fs.writeFileSync('SANCTUARY_TEST_IMAGE.jpg', buffer);
console.log("SUCCESS: Created SANCTUARY_TEST_IMAGE.jpg with high-risk EXIF metadata.");
