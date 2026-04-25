"use client";

import { useState, useEffect } from "react";
import type { ToolType } from "@/components/ToolNav";
import { ImageUpload } from "@/components/ImageUpload";
import { MetadataAudit } from "@/components/MetadataAudit";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ScreenshotRedactor } from "@/components/ScreenshotRedactor";
import { BatchFileList } from "@/components/BatchFileList";
import { useBatchProcessor } from "@/hooks/useBatchProcessor";
import { useImageScrubber } from "@/hooks/useImageScrubber";

export default function Dashboard() {
  const [currentTool, setCurrentTool] = useState<ToolType>("images");
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[*] Initializing kernel source: metadata-scrub-daemon...",
    "[*] Loading abstraction patterns: 48,201 patterns detected.",
    "[✓] Connection established with VAULT_NODE_ALPHA.",
  ]);

  const {
    processedImages,
    isProcessing: imageProcessing,
    handleImageUpload,
    neutralizeImage,
  } = useImageScrubber();

  const {
    files: batchFiles,
    processing: batchProcessing,
    addFiles,
    removeFile,
    downloadFile,
  } = useBatchProcessor();

  // Add logs when actions happen
  useEffect(() => {
    if (imageProcessing) {
      setTerminalLogs(prev => [...prev, `[!] ANALYZING_FILE: ${processedImages[0]?.originalFile.name || 'UNKNOWN'}`]);
    }
  }, [imageProcessing]);

  return (
    <div className="flex h-screen flex-col bg-[#FAFAFA] text-[#09090B] font-mono overflow-hidden select-none">
      {/* TOPBAR */}
      <header className="flex h-12 items-center justify-between border-b border-[#E4E4E7] bg-white px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tighter">METADATA_VAULT</span>
            <div className="h-2 w-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-[10px] font-bold text-[#10B981] tracking-widest">[ SYSTEM_ONLINE ]</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="relative">
            <input 
              type="text" 
              placeholder="QUERY_ID..." 
              className="w-48 bg-[#F4F4F5] border-none px-3 py-1 text-[10px] focus:ring-1 ring-[#10B981] outline-none"
            />
            <span className="absolute right-2 top-1.5 opacity-20 text-[10px]">/</span>
          </div>
          <div className="flex items-center gap-4 opacity-40">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd"/></svg>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.154.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.508-.417.702-1.1.432-1.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.844zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd"/></svg>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR */}
        <aside className="w-64 border-r border-[#E4E4E7] bg-white flex flex-col">
          <div className="p-6 space-y-8 flex-1">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">SYSTEM_CONTROLS</span>
              <nav className="space-y-1">
                <button 
                  onClick={() => setCurrentTool("images")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-tight uppercase transition-colors ${currentTool === 'images' ? 'bg-[#09090B] text-white' : 'hover:bg-gray-100'}`}
                >
                  <span className="opacity-40">01</span> INSPECTION
                </button>
                <button 
                  onClick={() => setCurrentTool("documents")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-tight uppercase transition-colors ${currentTool === 'documents' ? 'bg-[#09090B] text-white' : 'hover:bg-gray-100'}`}
                >
                  <span className="opacity-40">02</span> VAULT_STORAGE
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-tight uppercase opacity-30 cursor-not-allowed"
                >
                  <span className="opacity-40">03</span> SCRUB_LOGS
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-tight uppercase opacity-30 cursor-not-allowed"
                >
                  <span className="opacity-40">04</span> NETWORK_TRAFFIC
                </button>
                <button 
                  className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold tracking-tight uppercase opacity-30 cursor-not-allowed"
                >
                  <span className="opacity-40">05</span> ENCRYPTION
                </button>
              </nav>
            </div>
          </div>

          <div className="p-6 border-t border-[#E4E4E7] space-y-4">
            <button className="w-full py-2 border border-[#09090B] text-[10px] font-bold tracking-widest uppercase hover:bg-[#09090B] hover:text-white transition-all">
              EXECUTE_SCRUB
            </button>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.154.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567h.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.508-.417.702-1.1.432-1.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.844zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd"/></svg>
                SETTINGS
              </button>
              <button className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-black transition-colors uppercase">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 006 5.25v13.5a1.5 1.5 0 001.5 1.5h6a1.5 1.5 0 001.5-1.5V15a.75.75 0 011.5 0v3.75a3 3 0 01-3 3h-6a3 3 0 01-3-3V5.25a3 3 0 013-3h6a3 3 0 013 3V9A.75.75 0 0115 9V5.25a1.5 1.5 0 00-1.5-1.5h-6zm10.72 4.72a.75.75 0 011.06 0l3 3a.75.75 0 010 1.06l-3 3a.75.75 0 11-1.06-1.06l1.72-1.72H9a.75.75 0 010-1.5h10.94l-1.72-1.72a.75.75 0 010-1.06z" clipRule="evenodd"/></svg>
                LOGOUT
              </button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#F4F4F5] p-6 gap-6">
          <div className="flex-1 flex gap-6 overflow-hidden">
            {/* LIGHTBOX / INSPECTOR */}
            <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
              {currentTool === 'images' && (
                <div className="space-y-6">
                  {processedImages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-[#E4E4E7] bg-white space-y-4">
                      <ImageUpload onImageSelect={handleImageUpload} isProcessing={imageProcessing} />
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Awaiting input for forensic analysis
                      </p>
                    </div>
                  ) : (
                    processedImages.map((image) => (
                      <div key={image.id} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Image Preview with Scan Box */}
                        <div className="relative border border-[#09090B] bg-black aspect-video overflow-hidden group">
                          {image.originalFile && (
                            <img 
                              src={URL.createObjectURL(image.originalFile)} 
                              className="w-full h-full object-contain opacity-80 grayscale"
                              alt="Forensic Preview"
                            />
                          )}
                          {/* Green Scan Box */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1/2 h-1/2 border-2 border-[#10B981] relative">
                              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#10B981] -translate-x-1 -translate-y-1" />
                              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#10B981] translate-x-1 -translate-y-1" />
                              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#10B981] -translate-x-1 translate-y-1" />
                              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#10B981] translate-x-1 translate-y-1" />
                              
                              {/* Scanline */}
                              <div className="absolute inset-x-0 h-[2px] bg-[#10B981] shadow-[0_0_15px_#10B981] animate-scanline opacity-50" />
                            </div>
                          </div>
                          {/* Corner Metadata Overlays */}
                          <div className="absolute bottom-4 left-4 bg-black/80 px-2 py-1 text-[9px] font-bold text-[#10B981]">
                            COORD_X: 34.0522 | COORD_Y: -118.2437 | LOC: LOS_ANGELES
                          </div>
                        </div>

                        <MetadataAudit image={image} onNeutralize={neutralizeImage} />
                      </div>
                    ))
                  )}
                </div>
              )}

              {currentTool === 'documents' && (
                <div className="space-y-6">
                  <div className="bg-white border border-[#E4E4E7] p-8 space-y-6">
                    <DocumentUpload onFilesSelect={addFiles} isProcessing={batchProcessing} />
                    <BatchFileList files={batchFiles} onRemove={removeFile} onDownload={downloadFile} />
                  </div>
                </div>
              )}

              {currentTool === 'screenshots' && (
                <ScreenshotRedactor onFileSelect={() => undefined} isProcessing={false} />
              )}
            </div>

            {/* RIGHT SIDEBAR: STATUS & DAEMONS */}
            <aside className="w-80 flex flex-col gap-6">
              <div className="bg-[#09090B] text-white p-6 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-[0.3em] text-[#10B981] uppercase">PRIVACY_VAULT_STATUS</span>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Buffer Saturation</span>
                    <span className="text-xl font-black tracking-tighter">88.4%</span>
                  </div>
                  <div className="h-1 w-full bg-gray-800">
                    <div className="h-full bg-[#10B981]" style={{ width: '88.4%' }} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Uploads</span>
                    <div className="text-lg font-black tracking-tighter">1,204</div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase">Scrubbed</span>
                    <div className="text-lg font-black tracking-tighter text-[#10B981]">1,198</div>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-white border border-[#E4E4E7] p-6 space-y-6">
                <span className="text-[10px] font-bold tracking-[0.3em] text-gray-400 uppercase">ACTIVE_DAEMONS</span>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#10B981] mt-1.5" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-tight">GPS_STRIPPER_V2.4</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Status: [ ACTIVE_LISTENING ]</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-gray-300 mt-1.5" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-tight">EXIF_OVERWRITER</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Status: [ SUSPENDED ]</div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-1.5 h-1.5 bg-[#10B981] mt-1.5" />
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-tight">IMAGIQ_VERIFIER</div>
                      <div className="text-[9px] text-gray-400 font-bold uppercase">Status: [ VERIFYING_INTEGRITY ]</div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>

          {/* BOTTOM TERMINAL */}
          <div className="h-48 bg-[#09090B] text-[#10B981] p-4 font-mono text-[10px] space-y-1 overflow-y-auto border-t-2 border-[#10B981]/20">
            <div className="flex justify-between items-center mb-2 border-b border-[#10B981]/10 pb-1">
              <span className="font-bold tracking-widest uppercase">TERMINAL_OUTPUT_SESSION_#44852</span>
              <span className="text-[8px] opacity-40 uppercase tracking-widest">Auto_Reload: ON | GPS_KERNEL_8.2.1</span>
            </div>
            {terminalLogs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="opacity-40">[{new Date().toLocaleTimeString()}]</span>
                <span className={log.startsWith('[!]') ? 'text-[#F43F5E]' : log.startsWith('[✓]') ? 'text-[#10B981]' : ''}>
                  {log}
                </span>
              </div>
            ))}
            <div className="animate-pulse">_</div>
          </div>
        </main>
      </div>

      {/* FOOTER BAR */}
      <footer className="h-8 bg-[#09090B] text-white flex items-center justify-between px-6 text-[8px] font-bold tracking-[0.4em] uppercase">
        <div className="flex gap-4">
          <span className="text-[#10B981]">[STATUS:SECURE]</span>
          <span className="opacity-40">MAPPER:0.004S</span>
          <span className="opacity-40">ENCRYPTION:AES_256</span>
        </div>
        <div className="flex gap-4">
          <span className="text-[#F43F5E] hover:underline cursor-pointer">REPORT_BUG</span>
          <span className="opacity-40">API_DOCS</span>
        </div>
      </footer>
    </div>
  );
}
