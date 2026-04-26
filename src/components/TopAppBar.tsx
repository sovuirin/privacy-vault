"use client";

import React from "react";
import { Shield } from "lucide-react";

export type ToolType = "terminal" | "vault" | "monitor";

interface TopAppBarProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({ currentTool, onToolChange }) => {
  return (
    <div className="fixed top-8 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto flex items-center gap-1 p-1 bg-white/40 backdrop-blur-2xl rounded-full border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.08)]">
        {(["terminal", "vault", "monitor"] as const).map((tool) => (
          <button
            key={tool}
            onClick={() => onToolChange(tool)}
            className={`
              relative px-6 py-2 rounded-full transition-all duration-500
              ${currentTool === tool 
                ? "text-primary shadow-[0_2px_8px_rgba(93,57,224,0.1)]" 
                : "text-on-background/40 hover:text-on-background/80 hover:bg-white/40"
              }
            `}
          >
            {/* Active Background Pill */}
            {currentTool === tool && (
              <div className="absolute inset-0 bg-white rounded-full -z-10 shadow-sm" />
            )}
            
            <span className="label-luxe block relative">
              {tool}
            </span>
          </button>
        ))}
      </nav>
      
      {/* Branding - Optional but keeping it minimalist */}
      <div className="absolute top-1/2 -translate-y-1/2 left-12 flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity">
        <Shield size={16} className="text-primary" />
        <span className="label-luxe text-[8px]">Privacy Vault v2</span>
      </div>
    </div>
  );
};
