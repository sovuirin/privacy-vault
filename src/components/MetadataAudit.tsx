"use client";

import { useState } from "react";
import type { ScrubbedImageResult } from "@/hooks/useImageScrubber";

interface MetadataAuditProps {
  image: ScrubbedImageResult;
  onNeutralize: (id: string) => Promise<void>;
}

export function MetadataAudit({ image, onNeutralize }: MetadataAuditProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (!image.audit) return null;

  const { riskLevel, signals } = image.audit;
  const isHighRisk = riskLevel === "high";
  const isNeutralized = image.isNeutralized || image.status === "neutralized";
  const isNeutralizing = image.status === "neutralizing";

  const categories = {
    location: signals.filter((s) => s.category === "location"),
    device: signals.filter((s) => s.category === "device"),
    origin: signals.filter((s) => s.category === "origin"),
    sensitive: signals.filter((s) => s.category === "sensitive"),
  };

  return (
    <div className="font-mono text-sm border border-[#09090B] bg-[#FAFAFA] text-[#09090B] p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-[#09090B] pb-4">
        <div>
          <h2 className="text-lg font-bold tracking-tighter">METADATA AUDIT</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">FILE: {image.originalFile.name}</p>
        </div>
        {!isNeutralized && !isNeutralizing && (
          <div className={`font-bold border px-2 py-1 ${isHighRisk ? 'border-[#F43F5E] text-[#F43F5E]' : 'border-[#10B981] text-[#10B981]'}`}>
            [ RISK: {riskLevel.toUpperCase()} ]
          </div>
        )}
        {isNeutralized && (
          <div className="font-bold border border-[#10B981] text-[#10B981] px-2 py-1">
            [ SECURE ]
          </div>
        )}
      </div>

      {/* Body */}
      {isNeutralizing ? (
        <div className="py-12 flex flex-col items-center justify-center space-y-4 border border-[#09090B] bg-[#09090B] relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(255,255,255,0.05)_50%)] bg-[length:100%_4px] pointer-events-none z-10" />
          <div className="text-[#10B981] font-bold animate-pulse text-lg tracking-widest z-20">
            NEUTRALIZING...
          </div>
          <div className="text-xs text-gray-500 z-20 uppercase tracking-widest">Overwriting Metadata Sectors</div>
        </div>
      ) : isNeutralized ? (
        <div className="py-8 space-y-4 border border-[#10B981] bg-[rgba(16,185,129,0.03)] p-4">
          <div className="text-[#10B981] font-bold flex items-center gap-2 text-lg">
            <span>[+]</span> SIGNAL NEUTRALIZED
          </div>
          <div className="text-xs text-[#10B981]/70 tracking-tighter">
            TIMESTAMP: {new Date().toISOString()}
          </div>
          <div className="text-sm font-bold mt-4 text-[#f3f1ff] uppercase tracking-wide">Cleaned Canvas Ready</div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(categories).map(([cat, catsignals]) => {
              if (catsignals.length === 0) return null;
              return (
                <div key={cat} className="border border-[#09090B] p-3">
                  <div className="text-xs font-bold text-gray-500 uppercase mb-2 tracking-widest">
                    {cat}
                  </div>
                  <div className="text-[#F43F5E] font-bold text-xs flex items-center gap-2">
                    <span>[!]</span> SIGNAL DETECTED ({catsignals.length})
                  </div>
                </div>
              );
            })}
            {signals.length === 0 && (
              <div className="col-span-full border border-[#10B981] p-3 text-[#10B981] text-xs font-bold flex items-center gap-2 uppercase tracking-widest">
                <span>[+]</span> No signals detected
              </div>
            )}
          </div>

          {/* Action */}
          {!isNeutralized && signals.length > 0 && (
            <button
              onClick={() => onNeutralize(image.id)}
              disabled={isNeutralizing}
              className="w-full py-4 font-bold tracking-widest border border-[#09090B] bg-[#09090B] text-[#FAFAFA] hover:bg-[#FAFAFA] hover:text-[#09090B] transition-all duration-100 active:translate-y-[2px]"
            >
              NEUTRALIZE METADATA
            </button>
          )}
        </div>
      )}

      {/* Toggle Detailed Audit */}
      {signals.length > 0 && (
        <div className="pt-4 border-t border-[#09090B]">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-[10px] font-bold hover:text-black text-gray-500 flex items-center gap-2 tracking-widest"
          >
            {showDetails ? "[-] HIDE DETAILED AUDIT" : "[+] DETAILED AUDIT"}
          </button>
          
          {showDetails && (
            <div className="mt-4 p-4 border border-[#09090B] bg-[#FAFAFA] overflow-x-auto">
              <table className="w-full text-left text-[10px] sm:text-xs">
                <thead>
                  <tr className="text-gray-500 border-b border-[#09090B]">
                    <th className="pb-2 font-normal w-1/4 uppercase tracking-tighter">Category</th>
                    <th className="pb-2 font-normal w-1/4 uppercase tracking-tighter">Signal</th>
                    <th className="pb-2 font-normal w-1/2 uppercase tracking-tighter">Value</th>
                  </tr>
                </thead>
                <tbody className="align-top">
                  {signals.map((s) => (
                    <tr key={s.id} className="border-b border-[#111] last:border-0 hover:bg-[#0a0a0a]">
                      <td className="py-2 text-gray-400 uppercase tracking-tighter">{s.category}</td>
                      <td className="py-2 text-[#F43F5E] tracking-tighter">{s.label}</td>
                      <td className="py-2 text-gray-300 break-all tracking-tighter">{s.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
