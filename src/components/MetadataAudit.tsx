"use client";

import { BatchFile } from "@/lib/metadata";

interface MetadataAuditProps {
  image: BatchFile;
  onNeutralize: (id: string) => Promise<void>;
}

export function MetadataAudit({ image, onNeutralize }: MetadataAuditProps) {
  if (!image.report) return null;

  const { riskScore, signals, violationFlags } = image.report;
  const isNeutralized = image.isNeutralized || image.status === "neutralized";
  const isNeutralizing = image.status === "neutralizing";

  return (
    <div className="font-mono text-[11px] leading-tight border border-[#09090B] bg-[#FAFAFA] text-[#09090B] p-6 space-y-8">
      {/* PHOTO_INSPECTION_HEADER */}
      <div className="flex justify-between items-end border-b border-[#09090B] pb-2">
        <div>
          <h2 className="text-sm font-bold tracking-tighter uppercase">PHOTO_INSPECTION_MODULE</h2>
          <p className="text-[9px] text-gray-500 mt-1 uppercase opacity-70">
            FILE: {image.file.name} | {(image.file.size / 1024 / 1024).toFixed(1)} MB
          </p>
        </div>
        <div className="text-[9px] font-bold text-[#10B981] animate-pulse">
          [ SYSTEM_ONLINE ]
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left/Center: Audit Matrix */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <span className="font-bold text-[10px] tracking-widest uppercase opacity-60">METADATA_AUDIT_MATRIX</span>
            <span className="text-[9px] text-[#10B981]">[ SCAN_COMPLETE ]</span>
          </div>
          
          <div className="border border-[#09090B] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#09090B] text-[#FAFAFA] uppercase tracking-tighter">
                  <th className="p-2 font-normal border-r border-[#FAFAFA]/10 w-20">TAG_ID</th>
                  <th className="p-2 font-normal border-r border-[#FAFAFA]/10">PROPERTY</th>
                  <th className="p-2 font-normal">VALUE [HEX_OFFSET]</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((s) => (
                  <tr key={s.id} className="border-b border-[#09090B] last:border-0 hover:bg-[#F0F0F0] transition-colors">
                    <td className="p-2 border-r border-[#09090B] text-gray-500">{s.tagId || '0x????'}</td>
                    <td className="p-2 border-r border-[#09090B] font-bold">{s.label}</td>
                    <td className={`p-2 ${s.isHighRisk ? 'text-[#F43F5E] font-bold' : 'text-[#09090B]'}`}>
                      {s.value} <span className="opacity-40 ml-2">[{s.hexOffset || '0x0000'}]</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Forensic Report */}
        <div className="space-y-8 border-l border-[#09090B] pl-8">
          <div className="space-y-2">
            <span className="font-bold text-[10px] tracking-widest uppercase opacity-60">FORENSIC_REPORT</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-4xl font-bold tracking-tighter ${riskScore > 70 ? 'text-[#F43F5E]' : 'text-[#09090B]'}`}>
                {riskScore}
              </span>
              <span className="text-sm font-bold text-gray-400">/100 RISK</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-gray-500">
              ENTROPY_SCORE: <span className="text-[#09090B]">7.84 bits/px</span>
            </div>
          </div>

          <div className="space-y-4">
            <span className="font-bold text-[10px] tracking-widest uppercase opacity-60">VIOLATION_FLAGS</span>
            <div className="space-y-2">
              {violationFlags.map((flag) => (
                <div key={flag} className="flex items-center gap-2 text-[10px] font-bold">
                  <div className={`w-1.5 h-1.5 ${riskScore > 70 ? 'bg-[#F43F5E]' : 'bg-[#10B981]'}`} />
                  <span className={riskScore > 70 ? 'text-[#F43F5E]' : 'text-[#09090B]'}>{flag}</span>
                </div>
              ))}
              {violationFlags.length === 0 && (
                <div className="text-gray-400 italic">[ NO_VIOLATIONS_DETECTED ]</div>
              )}
            </div>
          </div>

          {/* Action Trigger */}
          {!isNeutralized ? (
            <button
              onClick={() => onNeutralize(image.id)}
              disabled={isNeutralizing}
              className={`w-full py-4 text-xs font-bold tracking-[0.2em] transition-all relative group
                ${isNeutralizing 
                  ? 'bg-gray-200 text-gray-400 cursor-wait' 
                  : 'bg-[#F43F5E] text-[#FAFAFA] hover:bg-[#09090B] active:translate-y-[1px]'
                }`}
            >
              {isNeutralizing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-pulse">NEUTRALIZING...</span>
                </span>
              ) : (
                "NEUTRALIZE_THREAT"
              )}
              
              {/* Scanline effect for neutralizing state */}
              {isNeutralizing && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="w-full h-[2px] bg-[#FAFAFA]/20 animate-[scan_2s_linear_infinite]" />
                </div>
              )}
            </button>
          ) : (
            <div className="p-4 border border-[#10B981] bg-[#10B981]/5 text-[#10B981] font-bold text-center uppercase tracking-widest">
              [+] THREAT_NEUTRALIZED
            </div>
          )}
        </div>
      </div>

      {/* FOOTER_STATUS */}
      <div className="pt-4 border-t border-[#09090B] flex justify-between text-[8px] font-bold text-gray-400 tracking-[0.3em] uppercase">
        <div>VAULT_NODE: ALPHA_01</div>
        <div>KERNEL_STRATUM: SECURE_CORE</div>
        <div>TIMESTAMP: {new Date().toISOString().replace('T', ' ').slice(0, 19)}</div>
      </div>
    </div>
  );
}
