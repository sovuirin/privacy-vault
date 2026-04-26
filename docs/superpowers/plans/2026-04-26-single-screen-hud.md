# Single-Screen HUD Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Privacy Vault app into a 100dvh, non-scrolling immersive HUD experience with a persistent breathing texture and floating glassmorphic tool panels.

**Visual Reference:** [REQUIRED] Stitch Project: `N/A`, Screen ID: `N/A`. (Reference: docs/superpowers/specs/2026-04-26-single-screen-hud-design.md)

**Architecture:** We will constrain the global body to 100dvh and hidden overflow. The `page.tsx` will be refactored to treat the different tools (Terminal, Vault, Monitor) as absolute-positioned glassmorphic HUD overlays instead of block-level scrolling content. Navigation becomes a floating pill.

**Tech Stack:** Next.js App Router, Tailwind CSS, React.

---

### Task 1: Immersive Canvas & Global Layout

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Enforce 100dvh constraint in globals.css**
Update the body and HTML tags to prevent scrolling and establish the Solar Atelier base.

```css
@layer base {
  html, body {
    @apply h-[100dvh] overflow-hidden bg-[#fbf9f1] text-[#1b1c17] antialiased;
  }
}

/* Add custom animations for breathing texture and slide-up */
@keyframes breathe {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.05); }
}
.animate-breathe {
  animation: breathe 15s ease-in-out infinite;
}
```

- [ ] **Step 2: Add persistent atmospheric layer to layout.tsx**
Add the breathing texture behind the main content. Ensure you keep the existing imports and font setup.

```tsx
// Inside src/app/layout.tsx, replace the body tag and its contents:
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {/* Background Layer: Atmospheric Texture */}
        <div className="fixed inset-0 z-0 select-none pointer-events-none overflow-hidden bg-[#fbf9f1]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#fce4ec]/20 via-transparent to-[#e8f5e9]/20 animate-breathe mix-blend-multiply" />
        </div>
        
        {/* HUD Layer */}
        <div className="relative z-10 h-full w-full">
          {children}
        </div>
      </body>
    </html>
  );
}
```

### Task 2: Premium Pill Navigation

**Files:**
- Modify: `src/components/TopAppBar.tsx`

- [ ] **Step 1: Refactor TopAppBar to Floating Pill**
Change the TopAppBar from a full-width header to a centered pill (top on desktop, bottom on mobile).

```tsx
// src/components/TopAppBar.tsx
import { Shield } from "lucide-react";

export type ToolType = "terminal" | "vault" | "monitor";

interface TopAppBarProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
}

export function TopAppBar({ currentTool, onToolChange }: TopAppBarProps) {
  return (
    <div className="fixed z-50 w-full md:top-8 bottom-8 md:bottom-auto px-4 pointer-events-none flex justify-center">
      <nav className="pointer-events-auto bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-full p-2 flex items-center gap-2 transition-all hover:bg-white/60">
        <button 
          onClick={() => onToolChange("terminal")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${currentTool === 'terminal' ? 'bg-[#1b1c17] text-[#fbf9f1] shadow-md' : 'text-[#1b1c17]/60 hover:text-[#1b1c17] hover:bg-black/5'}`}
        >
          Terminal
        </button>
        <button 
          onClick={() => onToolChange("vault")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${currentTool === 'vault' ? 'bg-[#1b1c17] text-[#fbf9f1] shadow-md' : 'text-[#1b1c17]/60 hover:text-[#1b1c17] hover:bg-black/5'}`}
        >
          Vault
        </button>
        <button 
          onClick={() => onToolChange("monitor")}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${currentTool === 'monitor' ? 'bg-[#1b1c17] text-[#fbf9f1] shadow-md' : 'text-[#1b1c17]/60 hover:text-[#1b1c17] hover:bg-black/5'}`}
        >
          Monitor
        </button>
      </nav>
    </div>
  );
}
```

### Task 3: HUD Card Refactoring

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Convert Page structure to floating HUD**
Remove the `min-h-screen` background class, wrap the tools in centered absolute-positioned containers, and add custom scrollbars. Update `src/app/page.tsx` return statement. Remove the `<main>` container and traditional `<footer>`.

```tsx
  return (
    <main className="h-full w-full flex flex-col pointer-events-none selection:bg-primary/20 selection:text-primary text-[#1b1c17]">
      <TopAppBar currentTool={currentTool} onToolChange={setCurrentTool} />

      <div className="flex-1 w-full relative">
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-center items-center p-4 md:p-12 md:pt-28 pb-28 md:pb-12">
          
          {currentTool === "terminal" && (
            <div className="pointer-events-auto w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[3rem] p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 max-h-full overflow-y-auto">
              <RiskScoreHero 
                score={selectedFileId ? (images.find(img => img.id === selectedFileId)?.report?.riskScore || 0) : (aggregatedReport?.highestRiskScore || 0)} 
                status={selectedFileId ? (images.find(img => img.id === selectedFileId)?.isNeutralized ? "Secure" : "Scanning") : (images.length > 0 ? "Batch Mode" : "Ready")} 
                label={selectedFileId ? "File Risk Score" : "Batch Risk Index"}
              />
              {/* Keep the rest of the terminal content exactly as is */}
              ...
            </div>
          )}

          {currentTool === "vault" && (
            <div key="vault" className="pointer-events-auto w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[3rem] p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-left-4 duration-700 max-h-full overflow-y-auto">
               {/* Keep existing vault content */}
               ...
            </div>
          )}

          {currentTool === "monitor" && (
            <div key="monitor" className="pointer-events-auto w-full max-w-5xl bg-white/30 backdrop-blur-xl border border-white/40 shadow-2xl rounded-[3rem] p-8 md:p-12 space-y-12 animate-in fade-in slide-in-from-right-4 duration-700 max-h-full overflow-y-auto">
               {/* Keep existing monitor content */}
               ...
            </div>
          )}

        </div>
      </div>
    </main>
  );
```
