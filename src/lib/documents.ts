/**
 * Document cleanup helpers.
 * All processing happens in the browser. Files are never uploaded.
 */

export type DocumentType = "pdf" | "docx" | "pptx" | "xlsx";
export type DocumentCleanupOutcome = "cleaned" | "limited" | "unsupported";

export interface DocumentMetadata {
  filename: string;
  size: number;
  type: DocumentType;
  hasMetadata: boolean;
  metadataTypes: string[];
}

export interface DocumentCleanupResult {
  blob: Blob | null;
  metadata: DocumentMetadata;
  outcome: DocumentCleanupOutcome;
  summary: string;
}

const PDF_TYPE = "application/pdf";
const DOCX_TYPE =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const PPTX_TYPE =
  "application/vnd.openxmlformats-officedocument.presentationml.presentation";
const XLSX_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

function detectDocumentType(file: File): DocumentType {
  if (file.type === PDF_TYPE) return "pdf";
  if (file.type === DOCX_TYPE) return "docx";
  if (file.type === PPTX_TYPE) return "pptx";
  return "xlsx";
}

function replacePDFMetadata(raw: string): {
  output: string;
  removedTypes: string[];
  didModify: boolean;
} {
  const removedTypes: string[] = [];
  let output = raw;

  const replacements: Array<{ label: string; pattern: RegExp }> = [
    { label: "Author", pattern: /\/Author\s*\((?:\\.|[^()])*\)/g },
    { label: "Creator", pattern: /\/Creator\s*\((?:\\.|[^()])*\)/g },
    { label: "Producer", pattern: /\/Producer\s*\((?:\\.|[^()])*\)/g },
    { label: "Title", pattern: /\/Title\s*\((?:\\.|[^()])*\)/g },
    { label: "Subject", pattern: /\/Subject\s*\((?:\\.|[^()])*\)/g },
    { label: "Keywords", pattern: /\/Keywords\s*\((?:\\.|[^()])*\)/g },
    { label: "Creation Date", pattern: /\/CreationDate\s*\((?:\\.|[^()])*\)/g },
    { label: "Modified Date", pattern: /\/ModDate\s*\((?:\\.|[^()])*\)/g },
  ];

  replacements.forEach(({ label, pattern }) => {
    const next = output.replace(pattern, "");
    if (next !== output) {
      removedTypes.push(label);
      output = next;
    }
  });

  const xmpPattern = /<x:xmpmeta[\s\S]*?<\/x:xmpmeta>/g;
  const withoutXmp = output.replace(xmpPattern, "");
  if (withoutXmp !== output) {
    removedTypes.push("XMP Packet");
    output = withoutXmp;
  }

  return {
    output,
    removedTypes,
    didModify: output !== raw,
  };
}

async function cleanPDFMetadata(file: File): Promise<DocumentCleanupResult> {
  const buffer = await file.arrayBuffer();
  const raw = new TextDecoder("latin1").decode(buffer);
  const { output, removedTypes, didModify } = replacePDFMetadata(raw);
  const outputBytes = new Uint8Array(output.length);

  for (let index = 0; index < output.length; index += 1) {
    outputBytes[index] = output.charCodeAt(index) & 0xff;
  }

  return {
    blob: new Blob([outputBytes], { type: PDF_TYPE }),
    metadata: {
      filename: file.name,
      size: file.size,
      type: "pdf",
      hasMetadata: true,
      metadataTypes: removedTypes.length
        ? removedTypes
        : ["Document Properties", "XMP Packet"],
    },
    outcome: didModify ? "cleaned" : "limited",
    summary: didModify
      ? "Removed common PDF document properties and XMP metadata when detected."
      : "Could not confirm removable PDF metadata in this file. Review before sharing.",
  };
}

function officeMetadataTypes(type: DocumentType): string[] {
  if (type === "docx") {
    return ["Author", "Modified Date", "Revision History", "Comments"];
  }
  if (type === "pptx") {
    return ["Author", "Modified Date", "Presentation Properties"];
  }
  return ["Author", "Modified Date", "Workbook Properties"];
}

async function cleanOfficeDocument(
  file: File,
  type: Exclude<DocumentType, "pdf">
): Promise<DocumentCleanupResult> {
  return {
    blob: null,
    metadata: {
      filename: file.name,
      size: file.size,
      type,
      hasMetadata: true,
      metadataTypes: officeMetadataTypes(type),
    },
    outcome: "unsupported",
    summary:
      "This browser build cannot safely rewrite Office document metadata yet.",
  };
}

export async function cleanDocumentMetadata(
  file: File
): Promise<DocumentCleanupResult> {
  if (!isValidDocumentFormat(file)) {
    throw new Error("Unsupported document format. Supported: PDF, DOCX, PPTX, XLSX");
  }

  const type = detectDocumentType(file);
  if (type === "pdf") {
    return cleanPDFMetadata(file);
  }

  return cleanOfficeDocument(file, type);
}

export function isValidDocumentFormat(file: File): boolean {
  return [PDF_TYPE, DOCX_TYPE, PPTX_TYPE, XLSX_TYPE].includes(file.type);
}

export function buildCleanedDocumentFilename(filename: string): string {
  const extension = filename.match(/\.[^.]+$/)?.[0] ?? "";
  const base = extension ? filename.slice(0, -extension.length) : filename;
  return `${base}_cleaned${extension}`;
}

export function downloadCleanedDocument(blob: Blob, filename: string): void {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = buildCleanedDocumentFilename(filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
