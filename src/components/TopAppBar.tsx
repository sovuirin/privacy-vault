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
    <header className="glass-header">
      <div className="flex h-20 items-center justify-between px-12">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-lg shadow-primary/20">
            <Shield size={20} />
          </div>
          <span className="font-display text-2xl font-bold tracking-tight text-primary uppercase">
            Privacy Vault
          </span>
        </div>

        {/* Tool Switcher */}
        <nav className="absolute left-1/2 flex -translate-x-1/2 items-center gap-12">
          {(["terminal", "vault", "monitor"] as const).map((tool) => (
            <button
              key={tool}
              onClick={() => onToolChange(tool)}
              className={`group relative flex flex-col items-center py-2 transition-all duration-300`}
            >
              <span
                className={`label-luxe transition-colors duration-300 ${
                  currentTool === tool
                    ? "text-primary opacity-100"
                    : "text-on-background/40 group-hover:text-on-background/80"
                }`}
              >
                {tool}
              </span>
              {currentTool === tool && (
                <div className="absolute -bottom-1 h-1 w-1 rounded-full bg-secondary shadow-[0_0_8px_#705d00]" />
              )}
            </button>
          ))}
        </nav>

        {/* Status / User */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 rounded-full bg-surface-low px-4 py-2">
            <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
            <span className="label-luxe text-[8px] opacity-100">System Secure</span>
          </div>
          <div className="h-10 w-10 rounded-full bg-surface-high flex items-center justify-center text-on-background/40 hover:bg-surface-highest transition-colors cursor-pointer">
            <span className="material-symbols-outlined text-sm">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
