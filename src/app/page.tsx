"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  // Map our UI tools to the underlying logic
  // terminal -> image scrubbing
  // vault -> batch processing
  // monitor -> status/logs

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20 selection:text-primary">
      <TopAppBar currentTool={currentTool} onToolChange={setCurrentTool} />

      <main className="flex-1 container mx-auto px-12 pt-8 pb-24">
        <AnimatePresence mode="wait">
          {currentTool === "terminal" && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <RiskScoreHero 
                score={selectedFileId ? (images.find(img => img.id === selectedFileId)?.report?.riskScore || 0) : (aggregatedReport?.highestRiskScore || 0)} 
                status={selectedFileId ? (images.find(img => img.id === selectedFileId)?.isNeutralized ? "Secure" : "Scanning") : (images.length > 0 ? "Batch Mode" : "Ready")} 
                label={selectedFileId ? "File Risk Score" : "Batch Risk Index"}
              />

              <div className="space-y-16">
                {images.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 bg-surface-low/30 rounded-[2rem] border border-surface-high/50 space-y-6">
                    <ImageUpload onImageSelect={handleImageUpload} isProcessing={imageProcessing} />
                    <div className="text-center space-y-1">
                      <p className="label-luxe opacity-60">Awaiting Signal</p>
                      <p className="text-sm text-on-background/40">Drop your file into the sanctuary</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-12">
                    {/* Vault Gallery - minimalist row of thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2">
                      {images.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => selectFile(img.id === selectedFileId ? null : img.id)}
                          className={`relative h-20 w-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${img.id === selectedFileId ? 'border-primary scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}`}
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

                    <AnimatePresence mode="wait">
                      {selectedFileId ? (
                        <motion.div 
                          key={`detail-${selectedFileId}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-12"
                        >
                          {/* Premium Preview Wrapper */}
                          <div className="relative group rounded-[2rem] overflow-hidden bg-on-background shadow-2xl">
                            {images.find(img => img.id === selectedFileId)?.file && (
                              <img 
                                src={URL.createObjectURL(images.find(img => img.id === selectedFileId)!.file)} 
                                className={`w-full max-h-[600px] object-contain transition-all duration-1000 ${images.find(img => img.id === selectedFileId)?.isNeutralized ? 'grayscale-0 scale-100' : 'grayscale blur-sm opacity-60 scale-[1.02]'}`}
                                alt="Forensic Analysis"
                              />
                            )}
                            
                            {/* Status Overlay */}
                            {!images.find(img => img.id === selectedFileId)?.isNeutralized && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-[2px]">
                                <div className="h-[2px] w-full bg-primary/20 shadow-[0_0_20px_var(--primary)] animate-scanline" />
                                <div className="absolute top-12 left-12 flex items-center gap-3">
                                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                                  <span className="label-luxe text-white">Forensic Scan Active</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <ForensicMatrix 
                            mode="detail"
                            image={images.find(img => img.id === selectedFileId)} 
                            onNeutralize={neutralizeImage} 
                          />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="aggregate"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-12"
                        >
                          {!aggregatedReport && images.some(img => !img.report) && (
                            <div className="flex justify-center">
                              <button 
                                onClick={analyzeBatch}
                                className="btn-sovereign max-w-sm w-full"
                              >
                                ANALYZE BATCH ({images.filter(img => !img.report).length} FILES)
                              </button>
                            </div>
                          )}
                          <ForensicMatrix 
                            mode="aggregate"
                            files={images}
                            aggregatedReport={aggregatedReport}
                            onNeutralize={neutralizeImage}
                            onNeutralizeAll={neutralizeBatch}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

            </motion.div>
          )}

          {currentTool === "vault" && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
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
            </motion.div>
          )}

          {currentTool === "monitor" && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-12"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
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
