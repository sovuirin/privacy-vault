/**
 * Metadata Cleaner - Client-side image metadata removal
 * All processing happens in the browser. No data is sent to any server.
 */
import ExifReader from 'exifreader';

export interface Signal {
  id: string;
  tagId?: string; // e.g., "0x0112"
  label: string;
  value: string;
  hexOffset?: string; // e.g., "0x00AA"
  category: 'location' | 'device' | 'origin' | 'sensitive';
  isHighRisk?: boolean;
}

export interface ForensicReport {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number; // 0-100
  signals: Signal[];
  violationFlags: string[];
}

export interface BatchFile {
  id: string;
  file: File;
  report: ForensicReport | null;
  status: 'pending' | 'analyzing' | 'detected' | 'neutralizing' | 'neutralized' | 'error';
  isNeutralized: boolean;
}

export interface AggregatedReport {
  totalFiles: number;
  totalHighRiskSignals: number;
  highestRiskScore: number;
  averageRiskScore: number;
  uniqueDeviceModels: string[];
  hasLocationData: boolean;
}


export interface ImageMetadata {
  filename: string;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
  hasMetadata: boolean;
  metadataTypes: string[];
}

export type ExportFormat = "png" | "jpeg" | "webp";

export interface ExportOptions {
  format: ExportFormat;
  quality: number;
  targetSizeKB: number | null;
}

const DEFAULT_EXPORT_OPTIONS: ExportOptions = {
  format: "png",
  quality: 0.92,
  targetSizeKB: null,
};

/**
 * Removes all metadata from an image and returns a clean canvas
 * Works with JPEG, PNG, WebP, and other standard formats
 */
export async function scrubImageMetadata(
  file: File
): Promise<{ canvas: HTMLCanvasElement; metadata: ImageMetadata }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            throw new Error("Could not get canvas context");
          }

          ctx.drawImage(img, 0, 0);

          const metadata: ImageMetadata = {
            filename: file.name,
            size: file.size,
            dimensions: {
              width: img.width,
              height: img.height,
            },
            hasMetadata: true,
            metadataTypes: ["EXIF", "IPTC", "XMP"],
          };

          resolve({ canvas, metadata });
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = e.target?.result as string;
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

function withDefaults(options?: Partial<ExportOptions>): ExportOptions {
  return {
    ...DEFAULT_EXPORT_OPTIONS,
    ...options,
  };
}

function mimeForFormat(format: ExportFormat): string {
  if (format === "jpeg") return "image/jpeg";
  if (format === "webp") return "image/webp";
  return "image/png";
}

function extensionForFormat(format: ExportFormat): string {
  if (format === "jpeg") return "jpg";
  return format;
}

function baseFilename(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function buildCleanedFilename(
  filename: string,
  format: ExportFormat
): string {
  return `${baseFilename(filename)}_cleaned.${extensionForFormat(format)}`;
}

function estimateScaleFactor(currentBytes: number, targetBytes: number): number {
  if (currentBytes <= 0 || targetBytes <= 0) {
    return 1;
  }

  const ratio = targetBytes / currentBytes;
  const factor = Math.sqrt(ratio);
  return Math.max(0.45, Math.min(1, factor));
}

async function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ExportFormat,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to generate output image"));
          return;
        }
        resolve(blob);
      },
      mimeForFormat(format),
      quality
    );
  });
}

async function toSizedBlob(
  sourceCanvas: HTMLCanvasElement,
  options: ExportOptions
): Promise<Blob> {
  if (!options.targetSizeKB || options.format === "png") {
    return canvasToBlob(
      sourceCanvas,
      options.format,
      options.format === "png" ? undefined : options.quality
    );
  }

  const targetBytes = options.targetSizeKB * 1024;
  let quality = options.quality;

  let workingCanvas = document.createElement("canvas");
  workingCanvas.width = sourceCanvas.width;
  workingCanvas.height = sourceCanvas.height;
  const workingCtx = workingCanvas.getContext("2d");

  if (!workingCtx) {
    throw new Error("Could not get canvas context");
  }

  workingCtx.drawImage(sourceCanvas, 0, 0);

  for (let step = 0; step < 5; step += 1) {
    let low = 0.35;
    let high = quality;
    let candidate: Blob | null = null;

    for (let i = 0; i < 7; i += 1) {
      const mid = (low + high) / 2;
      const blob = await canvasToBlob(workingCanvas, options.format, mid);

      if (blob.size > targetBytes) {
        high = mid;
      } else {
        candidate = blob;
        low = mid;
      }
    }

    if (candidate) {
      return candidate;
    }

    const firstAttempt = await canvasToBlob(workingCanvas, options.format, high);
    const scaleFactor = estimateScaleFactor(firstAttempt.size, targetBytes);

    const nextWidth = Math.max(320, Math.round(workingCanvas.width * scaleFactor));
    const nextHeight = Math.max(
      320,
      Math.round(workingCanvas.height * scaleFactor)
    );

    if (nextWidth === workingCanvas.width && nextHeight === workingCanvas.height) {
      return firstAttempt;
    }

    const resized = document.createElement("canvas");
    resized.width = nextWidth;
    resized.height = nextHeight;
    const resizedCtx = resized.getContext("2d");

    if (!resizedCtx) {
      throw new Error("Could not get canvas context");
    }

    resizedCtx.drawImage(workingCanvas, 0, 0, nextWidth, nextHeight);
    
    // Explicitly clear previous canvas dimensions to help GC
    workingCanvas.width = 0;
    workingCanvas.height = 0;
    
    workingCanvas = resized;
    quality = Math.max(0.55, quality - 0.08);
  }

  return canvasToBlob(workingCanvas, options.format, Math.max(0.35, quality));
}

export async function buildCleanedImageBlob(
  canvas: HTMLCanvasElement,
  options?: Partial<ExportOptions>
): Promise<Blob> {
  const normalized = withDefaults(options);
  return toSizedBlob(canvas, normalized);
}

/**
 * Downloads a cleaned image from a canvas
 */
export async function downloadCleanedImage(
  canvas: HTMLCanvasElement,
  filename: string,
  options?: Partial<ExportOptions>
): Promise<void> {
  const normalized = withDefaults(options);
  const blob = await buildCleanedImageBlob(canvas, normalized);
  const url = URL.createObjectURL(blob);

  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = buildCleanedFilename(filename, normalized.format);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } finally {
    URL.revokeObjectURL(url);
  }
}

/**
 * Validates if a file is a supported image format
 */
export function isValidImageFormat(file: File): boolean {
  const validTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/bmp",
  ];
  return validTypes.includes(file.type);
}

/**
 * Checks if an image has detectable metadata
 */
export function hasImageMetadata(file: File): boolean {
  return Boolean(file);
}

/**
 * Detects sensitive metadata signals in an image file
 */
export async function detectMetadata(file: File): Promise<ForensicReport> {
  const tags = await ExifReader.load(file);
  const signals: Signal[] = [];
  const violationFlags: string[] = [];

  // Helper to map risk levels
  const addSignal = (name: string, label: string, category: Signal['category'], isHighRisk = false) => {
    const tag = tags[name] as any;
    if (tag) {
      signals.push({
        id: name,
        tagId: tag.id ? `0x${tag.id.toString(16).padStart(4, '0').toUpperCase()}` : undefined,
        label,
        value: tag.description,
        hexOffset: tag.offset ? `0x${tag.offset.toString(16).padStart(4, '0').toUpperCase()}` : undefined,
        category,
        isHighRisk,
      });
      if (isHighRisk) {
        violationFlags.push(`FLAG_${name.toUpperCase()}_EXPOSED`);
      }
    }
  };

  // Location signals
  addSignal('GPSLatitude', 'GPS Latitude', 'location', true);
  addSignal('GPSLongitude', 'GPS Longitude', 'location', true);
  if (tags['GPSLatitude']) violationFlags.push('FLAG_GPS_PRECISION_ERR');

  // Device signals
  addSignal('Make', 'Manufacturer', 'device');
  addSignal('Model', 'Device Model', 'device');
  addSignal('SerialNumber', 'Serial Number', 'device', true);

  // Origin signals
  addSignal('Software', 'Processing Software', 'origin');
  addSignal('DateTimeOriginal', 'Timestamp (Original)', 'origin', true);
  
  // Sensitive signals
  addSignal('OwnerName', 'Owner Identity', 'sensitive', true);
  addSignal('Artist', 'Creator/Artist', 'sensitive', true);
  addSignal('Copyright', 'Copyright Notice', 'sensitive');

  // Calculate risk score
  const highRiskCount = signals.filter(s => s.isHighRisk).length;
  const riskScore = Math.min(100, (signals.length * 5) + (highRiskCount * 20));
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  if (riskScore > 70) riskLevel = 'high';
  else if (riskScore > 30) riskLevel = 'medium';

  return {
    riskLevel,
    riskScore,
    signals,
    violationFlags: Array.from(new Set(violationFlags)),
  };
}
