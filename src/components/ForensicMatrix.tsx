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
  onNeutralize: (id: string) => Promise<void>;
  onNeutralizeAll?: () => Promise<void>;
}

export const ForensicMatrix: React.FC<ForensicMatrixProps> = ({ 
  mode,
  image, 
  files,
  aggregatedReport,
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
  const violationFlags = activeReport?.violationFlags || [];
  const isNeutralized = mode === 'detail' ? (image?.isNeutralized || image?.status === "neutralized") : false;
  const isNeutralizing = mode === 'detail' ? image?.status === "neutralizing" : false;

  const categories = [
    { id: "location", label: "Geographic Traces", icon: MapPin },
    { id: "device", label: "Hardware Signature", icon: Smartphone },
    { id: "origin", label: "Temporal Origin", icon: Fingerprint },
    { id: "sensitive", label: "System Metadata", icon: ShieldAlert },
  ];

  const getSignalsByCategory = (catId: string) => 
    signals.filter(s => s.category === catId);

  return (
    <div className="space-y-12 py-8">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => {
          const catSignals = getSignalsByCategory(cat.id);
          const Icon = cat.icon;
          
          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card-bento min-h-[280px] flex flex-col no-line-boundary"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-surface-low text-primary">
                  <Icon size={18} />
                </div>
                <span className="label-luxe">{cat.label}</span>
              </div>

              <div className="flex-1 space-y-4">
                {catSignals.length > 0 ? (
                  catSignals.slice(0, showDetails ? undefined : 2).map((s) => (
                    <div key={s.id} className="space-y-1">
                      <div className="text-[11px] font-bold text-on-background/40 uppercase tracking-tighter">
                        {s.label}
                      </div>
                      <div className={`text-sm font-medium tracking-tight ${s.isHighRisk && !isNeutralized ? 'text-primary' : 'text-on-background'}`}>
                        {isNeutralized ? "• • • • • •" : s.value}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full text-on-background/20 italic text-[11px]">
                    No signals detected
                  </div>
                )}
              </div>
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
