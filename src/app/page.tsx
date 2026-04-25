"use client";

import { useState } from "react";
import type { ToolType } from "@/components/ToolNav";
import { ToolNav } from "@/components/ToolNav";
import { ImageUpload } from "@/components/ImageUpload";
import { ImagePreview } from "@/components/ImagePreview";
import { ImageDownload } from "@/components/ImageDownload";
import { MetadataAudit } from "@/components/MetadataAudit";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ScreenshotRedactor } from "@/components/ScreenshotRedactor";
import { BatchFileList } from "@/components/BatchFileList";
import { useBatchProcessor } from "@/hooks/useBatchProcessor";
import { useImageScrubber } from "@/hooks/useImageScrubber";

function BetaNotice({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgba(214,181,108,0.24)] bg-[rgba(214,181,108,0.1)] px-4 py-3">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 rounded-full border border-[rgba(214,181,108,0.26)] bg-[rgba(214,181,108,0.14)] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-[#d6b56c]">
          Beta
        </span>
        <div>
          <p className="font-semibold text-[#f4e5bf]">{title}</p>
          <p className="mt-1 text-sm text-[#e1cc91]">{description}</p>
        </div>
      </div>
    </div>
  );
}

function ShareChecklist({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="card">
      <p className="eyebrow">Before You Upload</p>
      <h3 className="mt-2 text-lg font-semibold text-white">{title}</h3>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-2 rounded-xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.03)] px-3 py-2"
          >
            <span className="mt-0.5 text-[#86d3bb]">•</span>
            <p className="text-sm text-[#d8d3ee]">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [currentTool, setCurrentTool] = useState<ToolType>("images");
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false);

  const {
    processedImages,
    isProcessing: imageProcessing,
    error: imageError,
    handleImageUpload,
    neutralizeImage,
  } = useImageScrubber();

  const {
    files: batchFiles,
    processing: batchProcessing,
    addFiles,
    removeFile,
    clearAll,
    processBatch,
    downloadFile,
  } = useBatchProcessor();

  const renderToolContent = () => {
    switch (currentTool) {
      case "images":
        return (
          <div className="space-y-6">
            <ImageUpload
              onImageSelect={handleImageUpload}
              isProcessing={imageProcessing}
            />

            <ShareChecklist
              title="Check image files before they reach AI tools or online platforms"
              items={[
                "Remove hidden metadata like location, device, and editing history before uploading images to chatbots or social apps.",
                "Review the visible image too. Metadata cleanup does not hide names, faces, screens, or documents shown in the picture.",
                "Use the export settings below if you need a smaller file before sharing.",
              ]}
            />

            {imageProcessing && (
              <div className="rounded-2xl border border-[rgba(109,156,255,0.28)] bg-[rgba(109,156,255,0.1)] px-4 py-3 text-sm text-[#dce6ff]">
                Cleaning image metadata locally. Keep this tab open until your
                export options appear.
              </div>
            )}

            {imageError && (
              <div className="rounded-2xl border border-[rgba(255,159,159,0.22)] bg-[rgba(255,159,159,0.1)] p-4">
                <p className="font-medium text-[#ffd0d0]">
                  Some files need attention
                </p>
                <p className="mt-1 text-sm text-[#ffb3b3]">{imageError}</p>
              </div>
            )}

            {processedImages.length > 0 && (
              <div className="space-y-6">
                {processedImages.map((image) => (
                  <MetadataAudit
                    key={image.id}
                    image={image}
                    onNeutralize={neutralizeImage}
                  />
                ))}
              </div>
            )}

            {processedImages.some((img) => img.isNeutralized) && (
              <>
                <ImageDownload
                  images={processedImages.filter((img) => img.isNeutralized)}
                />
                <ImagePreview
                  images={processedImages.filter((img) => img.isNeutralized)}
                />
              </>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="card">
                <div className="mb-3 flex items-center gap-3">
                  <svg
                    className="h-7 w-7 text-[#6d9cff]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <h3 className="text-lg font-black text-white">
                    Supported formats
                  </h3>
                </div>
                <p className="text-sm font-semibold text-[#dce6ff]">
                  JPG, PNG, WebP, GIF, and BMP files can be cleaned here.
                </p>
              </div>

              <div className="card">
                <div className="mb-3 flex items-center gap-3">
                  <svg
                    className="h-6 w-6 text-[#d6b56c]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="font-bold text-white">What&apos;s next</h3>
                </div>
                <p className="text-sm text-[#b9b2d9]">
                  Document cleanup and screenshot redaction cover the visible
                  and document-based details that metadata stripping alone
                  cannot catch.
                </p>
              </div>
            </div>
          </div>
        );

      case "documents":
        return (
          <div className="space-y-6">
            <BetaNotice
              title="Document Cleaner is an early release"
              description="PDF cleanup is best-effort today. Office files are listed so you can see current support boundaries before sharing them."
            />
            <DocumentUpload
              onFilesSelect={addFiles}
              isProcessing={batchProcessing}
            />

            <ShareChecklist
              title="Check documents before uploading them into assistants or workspace tools"
              items={[
                "PDF and Office files can include author names, revision timestamps, comments, and document properties.",
                "The current PDF flow makes a best effort to remove common metadata fields when it can detect them.",
                "Office files are reviewed honestly in this build, but full metadata rewriting is not available yet.",
              ]}
            />

            <BatchFileList
              files={batchFiles}
              onRemove={removeFile}
              onDownload={downloadFile}
            />

            {batchFiles.length > 0 && (
              <div className="flex gap-3">
                <button
                  onClick={processBatch}
                  disabled={batchProcessing}
                  className="btn-primary flex-1"
                >
                  {batchProcessing ? "Reviewing..." : "Review Documents"}
                </button>
                <button onClick={clearAll} className="btn-secondary">
                  Clear All
                </button>
              </div>
            )}
          </div>
        );

      case "screenshots":
        return (
          <div className="space-y-6">
            <BetaNotice
              title="Screenshot Redactor is ready for early use"
              description="Use it to cover visible details before sharing screenshots with AI tools, social apps, or coworkers."
            />

            <ShareChecklist
              title="Screenshots often leak more than metadata"
              items={[
                "Look for prompts, names, emails, tokens, account numbers, URLs, and internal tool names.",
                "Use blackout for anything that must be fully hidden. Use blur when you only need a softer mask.",
                "Download the redacted copy before you upload, post, or paste the screenshot anywhere else.",
              ]}
            />

            <ScreenshotRedactor
              onFileSelect={() => undefined}
              isProcessing={false}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 text-center">
          <p className="eyebrow">Built For The Frontier</p>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full border border-[rgba(157,139,210,0.18)] bg-[linear-gradient(135deg,rgba(141,115,214,0.18),rgba(109,156,255,0.18))] p-3 shadow-2xl">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-3 text-4xl font-black text-white sm:text-5xl">
            Privacy Vault
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-[#d8d3ee]">
            Clean files before they reach AI tools, social platforms, or work
            systems. Remove hidden metadata, cover visible details, and do it
            all in your browser with no server uploads.
          </p>
        </div>

        <div className="panel mb-6 p-4">
          <div className="flex gap-3">
            <svg
              className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#86d3bb]"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="mb-1 font-semibold text-white">
                Your privacy is respected
              </h3>
              <p className="text-sm text-[#b9b2d9]">
                Everything happens in your browser. Your files are not uploaded
                to a server. Use Privacy Vault before sending images to chat
                tools, posting screenshots online, or uploading documents into
                AI assistants.
              </p>
            </div>
          </div>
        </div>

        <ToolNav currentTool={currentTool} onToolChange={setCurrentTool} />

        <div className="mb-12">{renderToolContent()}</div>

        <div className="mt-12 border-t border-[rgba(157,139,210,0.16)] pt-8 text-center text-sm text-[#b9b2d9]">
          <button
            onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
            className="mb-4 font-medium text-[#6d9cff] hover:text-white"
          >
            {showPrivacyInfo ? "Hide" : "Learn More About"} Privacy & Security
          </button>
          {showPrivacyInfo && (
            <div className="mt-4 space-y-3 rounded-2xl border border-[rgba(157,139,210,0.18)] bg-[rgba(255,255,255,0.04)] p-4 text-left text-[#d8d3ee]">
              <p>
                <strong>Why does this matter now?</strong> Files are uploaded
                into AI chats, image tools, social apps, and automated systems
                more often than ever. Hidden metadata and visible details can
                travel with them.
              </p>
              <p>
                <strong>How does Privacy Vault help?</strong> It removes image
                metadata, helps you redact screenshots, and reviews documents in
                the browser before you share them.
              </p>
              <p>
                <strong>What can I use today?</strong> Image metadata cleanup is
                available now. Screenshot redaction is ready for early use. PDF
                cleanup is best-effort, and Office document cleanup is still
                limited in this build.
              </p>
              <p className="mt-4 text-xs text-[#938cb4]">
                All processing is client-side and no file data is sent to a
                server.
              </p>
            </div>
          )}
          <p className="mt-4">
            Simple privacy tools for modern file sharing.
          </p>
        </div>
      </div>
    </div>
  );
}
