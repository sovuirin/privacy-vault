"use client";

import React from "react";
import { motion } from "framer-motion";
import { BatchFile, AggregatedReport } from "@/lib/metadata";
import { MapPin, Smartphone, Fingerprint, ShieldAlert, CheckCircle2 } from "lucide-react";

interface ForensicMatrixProps {
  mode: 'aggregate' | 'detail';
  image?: BatchFile | null;
  files?: BatchFile[];
  aggregatedReport?: AggregatedReport | null;
  isProcessing?: boolean;
  onNeutralize: (id: string) => Promise<void>;
  onNeutralizeAll?: () => Promise<void>;
}

export const ForensicMatrix: React.FC<ForensicMatrixProps> = ({ 
  mode,
  image, 
  files,
  aggregatedReport,
  isProcessing = false,
  onNeutralize,
  onNeutralizeAll 
}) => {
  const [showDetails, setShowDetails] = React.useState(false);

  const activeReport = mode === 'detail' ? image?.report : null;
  
  if (mode === 'detail' && (!image || !activeReport)) return null;
  if (mode === 'aggregate' && !aggregatedReport) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="text-on-background/20 italic">
          {files && files.length > 0 ? `${files.length} files awaiting analysis` : 'Select a file or analyze batch to view forensics'}
        </div>
      </div>
    );
  }

  const signals = activeReport?.signals || [];
  const violationFlags = mode === 'detail' 
    ? (activeReport?.violationFlags || [])
    : Array.from(new Set(files?.flatMap(f => f.report?.violationFlags || []) || []));
  const isNeutralized = mode === 'detail' ? (image?.isNeutralized || image?.status === "neutralized") : false;
  const isNeutralizing = mode === 'detail' ? (image?.status === "neutralizing" || isProcessing) : isProcessing;

  const categories = [
    { id: "location", label: "Geographic Traces", icon: MapPin },
    { id: "device", label: "Hardware Signature", icon: Smartphone },
    { id: "origin", label: "Temporal Origin", icon: Fingerprint },
    { id: "sensitive", label: "System Metadata", icon: ShieldAlert },
  ];

  const getSignalsByCategory = (catId: string) => {
    if (mode === 'detail') {
      return signals.filter(s => s.category === catId);
    }
    
    // Aggregate mode: Summarize threats across the entire batch
    if (!files || files.length === 0) return [];
    
    const summary: Record<string, { label: string, count: number, isHighRisk: boolean }> = {};
    files.forEach(f => {
      f.report?.signals.forEach(s => {
        if (s.category === catId) {
          if (!summary[s.id]) {
            summary[s.id] = { label: s.label, count: 0, isHighRisk: !!s.isHighRisk };
          }
          summary[s.id].count++;
        }
      });
    });
    
    return Object.entries(summary).map(([id, data]) => ({
      id,
      label: data.label,
      value: `${data.count} Exposure${data.count > 1 ? 's' : ''}`,
      percentage: (data.count / files.length) * 100,
      isHighRisk: data.isHighRisk,
      category: catId
    }));
  };

  return (
    <div className="space-y-12 py-8">
      {mode === 'aggregate' && aggregatedReport && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { label: 'Batch Volume', value: files?.length, suffix: ' Files' },
            { label: 'Avg Risk Index', value: Math.round(aggregatedReport.averageRiskScore), suffix: '%' },
            { label: 'Critical Flags', value: files?.filter(f => f.report && f.report.riskLevel === 'high').length, suffix: ' High Risk' },
            { label: 'Neutralized', value: files?.filter(f => f.isNeutralized).length, suffix: ' Ready' }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-3xl bg-surface-low/50 border border-on-background/5 backdrop-blur-sm">
              <div className="text-[10px] font-bold text-on-background/30 uppercase tracking-widest mb-2">{stat.label}</div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-light tracking-tighter">{stat.value}</span>
                <span className="text-[10px] font-medium text-on-background/40">{stat.suffix}</span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="label-luxe opacity-100 text-sm">Forensic Matrix</h2>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-low hover:bg-surface-high transition-colors"
          >
            <div className={`h-2 w-2 rounded-full transition-colors ${showDetails ? 'bg-secondary' : 'bg-on-background/20'}`} />
            <span className="label-luxe !text-[8px] opacity-100">{showDetails ? 'Clinical Density' : 'Executive View'}</span>
          </button>
          {violationFlags.length > 0 && !isNeutralized && (
            <span className="text-[10px] font-bold text-primary animate-pulse uppercase tracking-widest">
              {violationFlags.length} Threats Detected
            </span>
          )}
          {isNeutralized && (
            <div className="flex items-center gap-2 text-secondary">
              <CheckCircle2 size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Parity Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const catSignals = getSignalsByCategory(cat.id);
          const Icon = cat.icon;
          
          // Create asymmetric bento grid
          const spanClass = idx === 0 || idx === 3 ? "md:col-span-2" : "md:col-span-1";
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden p-8 bg-white/40 backdrop-blur-md rounded-[2rem] border border-white/20 shadow-lg min-h-[300px] flex flex-col ${spanClass}`}
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white/50 text-primary shadow-sm">
                    <Icon size={20} />
                  </div>
                  <span className="label-luxe">{cat.label}</span>
                </div>
                {catSignals.some(s => s.isHighRisk) && !isNeutralized && (
                  <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
                )}
              </div>

              <div className="flex-1 space-y-6">
                {catSignals.length > 0 ? (
                  <div className={`grid ${spanClass.includes('col-span-2') ? 'grid-cols-2 gap-x-8' : 'grid-cols-1'} gap-y-6`}>
                    {catSignals.slice(0, showDetails ? undefined : 4).map((s) => (
                      <div key={s.id} className="space-y-1.5 group">
                        <div className="text-[10px] font-bold text-on-background/30 uppercase tracking-widest group-hover:text-on-background/50 transition-colors">
                          {s.label}
                        </div>
                        <div className={`text-sm font-medium tracking-tight break-all ${s.isHighRisk && !isNeutralized ? 'text-primary' : 'text-on-background/80'}`}>
                          {isNeutralized ? (
                            <span className="opacity-30 tracking-[0.3em]">••••••••</span>
                          ) : (
                            <>
                              <div>{s.value || 'None'}</div>
                              {mode === 'aggregate' && 'percentage' in s && (
                                <div className="mt-1.5 h-1 w-full bg-black/5 rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(s as any).percentage}%` }}
                                    className={`h-full ${s.isHighRisk ? 'bg-primary' : 'bg-secondary'}`} 
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-on-background/10 italic text-[11px] font-medium uppercase tracking-widest">
                    Signature Clear
                  </div>
                )}
              </div>
              
              {/* Subtle background motif */}
              <div className="absolute -bottom-4 -right-4 opacity-[0.02] text-on-background">
                <Icon size={120} />
              </div>
              
              {/* Whisper Border Glow */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/40 pointer-events-none" />
            </motion.div>
          );
        })}
      </div>

      {!isNeutralized && (
        <div className="flex justify-center pt-8">
          <button
            onClick={() => mode === 'detail' ? (image && onNeutralize(image.id)) : onNeutralizeAll?.()}
            disabled={isNeutralizing}
            className="btn-sovereign w-full max-w-md group relative"
          >
            <span className={isNeutralizing ? "opacity-0" : "opacity-100"}>
              {mode === 'detail' ? 'NEUTRALIZE ALL THREATS' : 'NEUTRALIZE BATCH'}
            </span>
            {isNeutralizing && (
              <div className="absolute inset-0 flex items-center justify-center gap-3">
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="h-2 w-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            )}
          </button>
        </div>
      )}

    </div>
  );
};
