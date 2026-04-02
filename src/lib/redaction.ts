/**
 * Screenshot redaction helpers.
 * All processing happens in the browser. Files are never uploaded.
 */

export interface RedactionArea {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "blur" | "blackout";
  blurAmount?: number;
}

export function applyRedactions(
  sourceCanvas: HTMLCanvasElement,
  redactions: RedactionArea[]
): HTMLCanvasElement {
  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = sourceCanvas.width;
  outputCanvas.height = sourceCanvas.height;

  const outputCtx = outputCanvas.getContext("2d");
  if (!outputCtx) {
    throw new Error("Could not get canvas context");
  }

  outputCtx.drawImage(sourceCanvas, 0, 0);

  redactions.forEach((redaction) => {
    const { x, y, width, height } = normalizeArea(redaction);
    if (width < 1 || height < 1) {
      return;
    }

    if (redaction.type === "blackout") {
      outputCtx.fillStyle = "#000000";
      outputCtx.fillRect(x, y, width, height);
      return;
    }

    const blurCanvas = document.createElement("canvas");
    blurCanvas.width = width;
    blurCanvas.height = height;
    const blurCtx = blurCanvas.getContext("2d");

    if (!blurCtx) {
      return;
    }

    blurCtx.filter = `blur(${redaction.blurAmount ?? 14}px)`;
    blurCtx.drawImage(sourceCanvas, x, y, width, height, 0, 0, width, height);
    outputCtx.drawImage(blurCanvas, x, y);
  });

  return outputCanvas;
}

export function createImageCanvas(sourceImage: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = sourceImage.naturalWidth || sourceImage.width;
  canvas.height = sourceImage.naturalHeight || sourceImage.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not get canvas context");
  }

  ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
  return canvas;
}

export function downloadRedactedImage(
  canvas: HTMLCanvasElement,
  filename: string,
  format: "png" | "jpeg" = "png"
): void {
  const link = document.createElement("a");
  const extension = format === "png" ? "png" : "jpg";
  const mimeType = format === "png" ? "image/png" : "image/jpeg";
  const quality = format === "png" ? undefined : 0.95;

  link.href = canvas.toDataURL(mimeType, quality);
  link.download = filename.replace(/\.[^.]+$/, `_redacted.${extension}`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function downloadRedactionReport(
  filename: string,
  redactions: RedactionArea[]
): void {
  const report = generateRedactionReport(filename, redactions);
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename.replace(/\.[^.]+$/, "_redaction-report.txt");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

export function generateRedactionReport(
  filename: string,
  redactions: RedactionArea[]
): string {
  const lines = [
    "Privacy Vault Redaction Report",
    "",
    `File: ${filename}`,
    `Created: ${new Date().toISOString()}`,
    `Redactions: ${redactions.length}`,
    "",
  ];

  redactions.forEach((redaction, index) => {
    const { x, y, width, height } = normalizeArea(redaction);
    lines.push(
      `#${index + 1} ${redaction.type}`,
      `Position: ${x}, ${y}`,
      `Size: ${width} x ${height}px`,
      ""
    );
  });

  lines.push("Processed locally in the browser. No server upload.");
  return lines.join("\n");
}

function normalizeArea(area: Pick<RedactionArea, "x" | "y" | "width" | "height">) {
  const x = area.width < 0 ? area.x + area.width : area.x;
  const y = area.height < 0 ? area.y + area.height : area.y;
  const width = Math.abs(area.width);
  const height = Math.abs(area.height);

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}
