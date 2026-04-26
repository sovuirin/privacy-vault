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
import { motion, AnimatePresence } from "framer-motion";


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
    <div className="relative h-full w-full overflow-hidden">
      <TopAppBar currentTool={currentTool} onToolChange={setCurrentTool} />

      <main className="h-full w-full relative pt-28 pb-12 px-6 md:px-12">
        <AnimatePresence mode="wait">
          {currentTool === "terminal" && (
            <motion.div
              key="terminal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full max-w-7xl mx-auto flex flex-col gap-8"
            >
              <RiskScoreHero 
                score={selectedFileId ? (images.find(img => img.id === selectedFileId)?.report?.riskScore || 0) : (aggregatedReport?.highestRiskScore || 0)} 
                status={selectedFileId ? (images.find(img => img.id === selectedFileId)?.isNeutralized ? "Secure" : "Scanning") : (images.length > 0 ? "Batch Mode" : "Ready")} 
                label={selectedFileId ? "File Risk Score" : "Batch Risk Index"}
              />

              <div className="flex-1 min-h-0">
                {images.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-xl space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <ImageUpload onImageSelect={handleImageUpload} isProcessing={imageProcessing} />
                    <div className="text-center space-y-1 relative">
                      <p className="label-luxe opacity-60">Awaiting Signal</p>
                      <p className="text-xs text-on-background/30 uppercase tracking-widest font-bold">Drop your file into the sanctuary</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-full flex flex-col gap-8 overflow-hidden">
                    {/* Thumbnails */}
                    <div className="flex gap-4 overflow-x-auto pb-4 px-2 shrink-0 no-scrollbar">
                      {images.map((img) => (
                        <button
                          key={img.id}
                          onClick={() => selectFile(img.id === selectedFileId ? null : img.id)}
                          className={`relative h-16 w-16 rounded-2xl overflow-hidden transition-all shrink-0 ${img.id === selectedFileId ? 'scale-110 shadow-xl ring-4 ring-primary/20 z-10' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
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

                    {/* Main Work Area */}
                    <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-8">
                      {selectedFileId ? (
                        <>
                          <div className="flex-1 relative rounded-[2rem] overflow-hidden bg-black/5 shadow-2xl">
                            {images.find(img => img.id === selectedFileId)?.file && (
                              <img 
                                src={URL.createObjectURL(images.find(img => img.id === selectedFileId)!.file)} 
                                className="absolute inset-0 w-full h-full object-contain"
                                alt="Forensic Analysis"
                              />
                            )}
                            {!images.find(img => img.id === selectedFileId)?.isNeutralized && (
                              <div className="absolute inset-0 flex items-center justify-center bg-primary/5 backdrop-blur-[1px]">
                                <div className="h-[2px] w-full bg-primary/20 shadow-[0_0_20px_var(--primary)] animate-scanline" />
                              </div>
                            )}
                          </div>

                          <div className="w-full lg:w-[450px] overflow-y-auto no-scrollbar">
                            <ForensicMatrix 
                              mode="detail"
                              image={images.find(img => img.id === selectedFileId)} 
                              onNeutralize={neutralizeImage} 
                              isProcessing={imageProcessing}
                            />
                          </div>
                        </>
                      ) : (
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                          <div className="flex flex-col items-center gap-8 mb-12">
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
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentTool === "vault" && (
            <motion.div
              key="vault"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full max-w-4xl mx-auto flex flex-col gap-12"
            >
              <div className="space-y-4 text-center">
                <h1 className="text-5xl font-bold tracking-tight">The Vault</h1>
                <p className="text-lg text-on-background/60 mx-auto max-w-xl">
                  Batch processing for your most sensitive documents.
                </p>
              </div>

              <div className="flex-1 min-h-0 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/20 shadow-xl p-12 overflow-y-auto no-scrollbar">
                <div className="space-y-12">
                  <DocumentUpload onFilesSelect={addFiles} isProcessing={batchProcessing} />
                  <BatchFileList files={batchFiles} onRemove={removeFile} onDownload={downloadFile} />
                </div>
              </div>
            </motion.div>
          )}

          {currentTool === "monitor" && (
            <motion.div
              key="monitor"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full max-w-6xl mx-auto flex flex-col gap-12"
            >
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight">System Monitor</h1>
                <p className="text-lg text-on-background/60 max-w-xl">
                  Real-time visualization of kernel daemons.
                </p>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-bento flex flex-col">
                  <span className="label-luxe mb-6 block">Daemon Status</span>
                  <div className="flex-1 space-y-6 overflow-y-auto no-scrollbar">
                    {['GPS_STRIPPER', 'EXIF_OVERWRITER', 'IMAGIQ_VERIFIER'].map(d => (
                      <div key={d} className="flex items-center justify-between p-4 rounded-2xl bg-black/5">
                        <span className="font-medium">{d}</span>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-secondary" />
                          <span className="label-luxe text-[8px] opacity-40">Active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card-bento flex flex-col">
                  <span className="label-luxe mb-6 block">Sovereignty Logs</span>
                  <div className="flex-1 space-y-3 font-mono text-[10px] opacity-60 overflow-y-auto no-scrollbar">
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

      {/* Floating System Status */}
      <div className="fixed bottom-8 left-12 z-50 flex items-center gap-4">
        <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
        <span className="label-luxe text-[8px] opacity-40">AES-256 Sovereignty Active</span>
      </div>
    </div>
  );
}
