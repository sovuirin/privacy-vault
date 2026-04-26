"use client";

import { useState } from "react";
import { TopAppBar, ToolType } from "@/components/TopAppBar";
import { RiskScoreHero } from "@/components/RiskScoreHero";
import { ForensicMatrix } from "@/components/ForensicMatrix";
import { ImageUpload } from "@/components/ImageUpload";
import { DocumentUpload } from "@/components/DocumentUpload";
import { BatchFileList } from "@/components/BatchFileList";
import { useBatchProcessor } from "@/hooks/useBatchProcessor";
import { useImageScrubber } from "@/hooks/useImageScrubber";


export default function Dashboard() {
  const [currentTool, setCurrentTool] = useState<ToolType>("terminal");

  const {
    files: images,
    selectedFileId,
    aggregatedReport,
    isProcessing: imageProcessing,
    handleImageUpload,
    neutralizeImage,
    analyzeBatch,
    neutralizeBatch,
    selectFile,
  } = useImageScrubber();


  const {
    files: batchFiles,
    processing: batchProcessing,
    addFiles,
    removeFile,
    downloadFile,
  } = useBatchProcessor();

  return (
    <div 
      style={{ backgroundColor: '#fbf9f1' }}
      className="min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary text-[#1b1c17]"
    >
      <TopAppBar currentTool={currentTool} onToolChange={setCurrentTool} />

      <main className="flex-1 container mx-auto px-12 pt-8 pb-24">
        {currentTool === "terminal" && (
          <div className="space-y-12 animate-in fade-in duration-700">
            <RiskScoreHero 
              score={selectedFileId ? (images.find(img => img.id === selectedFileId)?.report?.riskScore || 0) : (aggregatedReport?.highestRiskScore || 0)} 
              status={selectedFileId ? (images.find(img => img.id === selectedFileId)?.isNeutralized ? "Secure" : "Scanning") : (images.length > 0 ? "Batch Mode" : "Ready")} 
              label={selectedFileId ? "File Risk Score" : "Batch Risk Index"}
            />

            <div className="space-y-16">
              {images.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 bg-surface-low/30 rounded-[3rem] space-y-8 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <ImageUpload onImageSelect={handleImageUpload} isProcessing={imageProcessing} />
                  <div className="text-center space-y-1 relative">
                    <p className="label-luxe opacity-60">Awaiting Signal</p>
                    <p className="text-xs text-on-background/30 uppercase tracking-widest font-bold">Drop your file into the sanctuary</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-12">
                  <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                    {images.map((img) => (
                      <button
                        key={img.id}
                        onClick={() => selectFile(img.id === selectedFileId ? null : img.id)}
                        className={`relative h-20 w-20 rounded-2xl overflow-hidden transition-all shrink-0 ${img.id === selectedFileId ? 'scale-110 shadow-2xl ring-4 ring-primary/20 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105 shadow-lg'}`}
                      >
                        <img 
                          src={URL.createObjectURL(img.file)} 
                          className="h-full w-full object-cover"
                          alt="Preview"
                        />
                        {img.isNeutralized && (
                          <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-secondary" />
                        )}
                      </button>
                    ))}
                  </div>

                  {selectedFileId ? (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="relative group rounded-[2rem] overflow-hidden bg-surface-high shadow-2xl">
                        {images.find(img => img.id === selectedFileId)?.file && (
                          <img 
                            src={URL.createObjectURL(images.find(img => img.id === selectedFileId)!.file)} 
                            className={`w-full max-h-[600px] object-contain transition-all duration-1000 ${images.find(img => img.id === selectedFileId)?.isNeutralized ? 'grayscale-0 scale-100' : 'grayscale-0 opacity-100 scale-[1.02]'}`}
                            alt="Forensic Analysis"
                          />
                        )}
                        {!images.find(img => img.id === selectedFileId)?.isNeutralized && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-[2px]">
                            <div className="h-[2px] w-full bg-primary/20 shadow-[0_0_20px_var(--primary)] animate-scanline" />
                            <div className="absolute top-12 left-12 flex items-center gap-3">
                              <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                              <span className="label-luxe !text-white">Forensic Scan Active</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <ForensicMatrix 
                        mode="detail"
                        image={images.find(img => img.id === selectedFileId)} 
                        onNeutralize={neutralizeImage} 
                        isProcessing={imageProcessing}
                      />
                    </div>
                  ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex flex-col items-center gap-8">
                        {!aggregatedReport && images.some(img => !img.report) && (
                          <button 
                            onClick={analyzeBatch}
                            className="btn-sovereign max-w-sm w-full"
                          >
                            ANALYZE BATCH ({images.filter(img => !img.report).length} FILES)
                          </button>
                        )}
                        
                        {images.some(img => img.isNeutralized) && (
                          <button 
                            onClick={async () => {
                              const { generateBatchZip } = await import("@/lib/zip");
                              const blob = await generateBatchZip(images);
                              const url = URL.createObjectURL(blob);
                              const link = document.createElement("a");
                              link.href = url;
                              link.download = "neutralized_sanctuary_batch.zip";
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                              URL.revokeObjectURL(url);
                            }}
                            className="flex items-center gap-3 px-8 py-3 rounded-xl bg-secondary text-white font-bold shadow-lg hover:scale-[1.02] transition-all"
                          >
                            <span>DOWNLOAD NEUTRALIZED BATCH</span>
                          </button>
                        )}
                      </div>

                      <ForensicMatrix 
                        mode="aggregate"
                        files={images}
                        aggregatedReport={aggregatedReport}
                        isProcessing={imageProcessing}
                        onNeutralize={neutralizeImage}
                        onNeutralizeAll={neutralizeBatch}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTool === "vault" && (
          <div key="vault" className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">The Vault</h1>
              <p className="text-lg text-on-background/60 max-w-xl">
                Batch processing for your most sensitive documents. Every file is scrubbed of temporal and geographic metadata.
              </p>
            </div>

            <div className="card-bento p-12 space-y-12">
              <DocumentUpload onFilesSelect={addFiles} isProcessing={batchProcessing} />
              <BatchFileList files={batchFiles} onRemove={removeFile} onDownload={downloadFile} />
            </div>
          </div>
        )}

        {currentTool === "monitor" && (
          <div key="monitor" className="space-y-12 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="space-y-4">
              <h1 className="text-5xl font-bold tracking-tight">System Monitor</h1>
              <p className="text-lg text-on-background/60 max-w-xl">
                Real-time visualization of kernel daemons and neutralization telemetry.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="card-bento">
                <span className="label-luxe mb-6 block">Daemon Status</span>
                <div className="space-y-6">
                  {['GPS_STRIPPER', 'EXIF_OVERWRITER', 'IMAGIQ_VERIFIER'].map(d => (
                    <div key={d} className="flex items-center justify-between">
                      <span className="font-medium">{d}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-secondary" />
                        <span className="label-luxe text-[8px] opacity-40">Active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card-bento">
                <span className="label-luxe mb-6 block">Sovereignty Logs</span>
                <div className="space-y-3 font-mono text-[10px] opacity-60">
                  <p>[*] kernel_ready: 1.0.2</p>
                  <p>[✓] vault_node_alpha: secure</p>
                  <p>[!] forensic_analysis: image_001.jpg</p>
                  <p>[✓] neutralize_complete: 884 traces removed</p>
                  <p className="animate-pulse">_</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="h-12 border-t border-surface-high flex items-center justify-between px-12 bg-surface-low/30 backdrop-blur-sm">
        <div className="flex gap-8 items-center">
          <span className="label-luxe text-[8px] opacity-40">Privacy Vault © 2026</span>
          <div className="h-1 w-1 rounded-full bg-surface-highest" />
          <span className="label-luxe text-[8px] opacity-40">AES-256 Sovereignty</span>
        </div>
        <div className="flex gap-8 items-center">
          <span className="label-luxe text-[8px] text-primary hover:opacity-100 transition-opacity cursor-pointer">Security Protocol</span>
          <span className="label-luxe text-[8px] hover:opacity-100 transition-opacity cursor-pointer">Legal Sanctuary</span>
        </div>
      </footer>
    </div>
  );
}
