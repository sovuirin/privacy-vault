import JSZip from "jszip";
import { BatchFile, buildCleanedFilename } from "./metadata";

/**
 * Generates a ZIP archive containing all neutralized images in a batch.
 */
export async function generateBatchZip(files: BatchFile[]): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder("privacy-vault-neutralized");

  if (!folder) throw new Error("Failed to create ZIP folder");

  const neutralizedFiles = files.filter(f => f.isNeutralized || f.status === 'neutralized');

  if (neutralizedFiles.length === 0) {
    throw new Error("No neutralized files available for export");
  }

  await Promise.all(
    neutralizedFiles.map(async (entry) => {
      if (entry.neutralizedBlob) {
        const filename = buildCleanedFilename(entry.file.name, "png");
        folder.file(filename, entry.neutralizedBlob);
      }
    })
  );

  return zip.generateAsync({ type: "blob" });
}
