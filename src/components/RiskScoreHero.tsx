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
    <section className="flex flex-col md:flex-row items-center gap-16 py-12 mb-16">
      <div className="flex-1 space-y-6">
        <div className="inline-block px-6 py-2 rounded-full bg-surface-low text-secondary shadow-inner-sm">
          <span className="label-luxe text-[9px] tracking-[0.25em]">System Status: {status}</span>
        </div>
        <h1 className="text-7xl font-bold tracking-tight leading-[0.9] text-on-background">
          Your Digital <br />
          <span className="text-primary">Sanctuary.</span>
        </h1>
        <p className="max-w-md text-lg text-on-background/60 leading-relaxed font-light">
          We protect your sovereignty by clinically neutralizing forensic traces before they leave your browser.
        </p>
      </div>

      <div className="relative h-64 w-64 flex items-center justify-center">
        {/* Simple Circular Gauge */}
        <svg className="h-full w-full -rotate-90 transform">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-transparent stroke-surface-high"
            strokeWidth="2"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            className="fill-transparent stroke-primary"
            strokeWidth="8"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * score) / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="label-luxe opacity-40">{label}</span>
          <span className="font-display text-6xl font-bold tracking-tighter">{score}</span>
          <span className="label-luxe text-secondary font-black tracking-[0.2em] mt-1">Sovereign</span>
        </div>
      </div>
    </section>
  );
};
