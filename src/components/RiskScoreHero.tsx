"use client";

import React from "react";
import { motion } from "framer-motion";

interface RiskScoreHeroProps {
  score: number;
  status: string;
  label?: string;
}

export const RiskScoreHero: React.FC<RiskScoreHeroProps> = ({ score, status, label = "Risk Score" }) => {
  return (
    <section className="flex flex-col md:flex-row items-center gap-12 py-8">
      <div className="flex-1 space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
          <div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
          <span className="label-luxe text-[8px] tracking-[0.25em]">{status}</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight leading-[0.9] text-on-background">
          Your Digital <br />
          <span className="text-primary">Sanctuary.</span>
        </h1>
        <p className="max-w-md text-base text-on-background/60 leading-relaxed font-light">
          We protect your sovereignty by clinically neutralizing forensic traces before they leave your browser.
        </p>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center bg-white/40 backdrop-blur-2xl rounded-full border border-white/20 shadow-2xl">
        {/* Simple Circular Gauge */}
        <svg className="h-[80%] w-[80%] -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-transparent stroke-black/5"
            strokeWidth="1"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-transparent stroke-primary"
            strokeWidth="6"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="label-luxe text-[8px] opacity-40">{label}</span>
          <span className="font-display text-6xl font-bold tracking-tighter">{score}</span>
          <span className="label-luxe text-secondary font-black tracking-[0.2em] mt-1">Sovereign</span>
        </div>
        
        {/* Whisper Border Glow */}
        <div className="absolute inset-0 rounded-full border border-white/40 pointer-events-none" />
      </div>
    </section>
  );
};
