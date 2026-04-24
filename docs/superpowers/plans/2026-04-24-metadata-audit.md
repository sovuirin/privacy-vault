# Metadata Audit & Neutralization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a two-phase "Intelligence Agency" style metadata detection and neutralization UI.

**Architecture:** Use `exifreader` for pre-scrub detection, refactor `useImageScrubber` into a state machine (None -> Detected -> Neutralized), and create a `MetadataAudit` component for the UI.

**Tech Stack:** React, Next.js, Tailwind CSS, `exifreader`.

---

### Task 1: Environment & Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install `exifreader`**

Run: `npm install exifreader`

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add exifreader dependency"
```

---

### Task 2: Core Metadata Intelligence (`lib/metadata.ts`)

**Files:**
- Modify: `src/lib/metadata.ts`

- [ ] **Step 1: Define Types and Audit Logic**

Add `Signal` and `MetadataAudit` types, and implement `detectMetadata`.

```typescript
import ExifReader from 'exifreader';

export interface Signal {
  id: string;
  label: string;
  value: string;
  category: 'location' | 'device' | 'origin' | 'sensitive';
}

export interface MetadataAudit {
  riskLevel: 'low' | 'medium' | 'high';
  signals: Signal[];
}

export async function detectMetadata(file: File): Promise<MetadataAudit> {
  const tags = await ExifReader.load(file);
  const signals: Signal[] = [];

  // Location
  if (tags['GPSLatitude'] || tags['GPSLongitude']) {
    signals.push({
      id: 'gps',
      label: 'Precise Location',
      value: `${tags['GPSLatitude']?.description}, ${tags['GPSLongitude']?.description}`,
      category: 'location'
    });
  }

  // Device
  if (tags['Make'] || tags['Model']) {
    signals.push({
      id: 'device',
      label: 'Device Identity',
      value: `${tags['Make']?.description} ${tags['Model']?.description}`,
      category: 'device'
    });
  }

  const riskLevel = signals.length > 2 ? 'high' : signals.length > 0 ? 'medium' : 'low';
  
  return { riskLevel, signals };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/metadata.ts
git commit -m "feat(metadata): add metadata detection logic"
```

---

### Task 3: State Machine Update (`hooks/useImageScrubber.ts`)

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Refactor Hook for Two-Phase Flow**

Update state to include `audit` and `isNeutralized`. Split `handleImageUpload` into `analyze` and `neutralize`.

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(hooks): refactor useImageScrubber for two-phase flow"
```

---

### Task 4: UI Component: `MetadataAudit.tsx`

**Files:**
- Create: `src/components/MetadataAudit.tsx`

- [ ] **Step 1: Implement the Component**

Build the "Report Card" view with the "Detailed Audit" toggle and "Neutralize Metadata" button. Use the "Frontier Dark" aesthetic.

- [ ] **Step 2: Commit**

```bash
git add src/components/MetadataAudit.tsx
git commit -m "feat(components): add MetadataAudit component"
```

---

### Task 5: Integration & Final Audit

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Integrate `MetadataAudit` into the main flow**

Place the component between `ImagePreview` and `ImageDownload`.

- [ ] **Step 2: Verification**

1. Upload an image with GPS data.
2. Verify "SIGNAL DETECTED" appears.
3. Toggle "Detailed Audit" to see raw values.
4. Click "Neutralize Metadata".
5. Verify "SIGNAL NEUTRALIZED" appears with timestamp.

- [ ] **Step 3: Final Commit**

```bash
git add src/app/page.tsx
git commit -m "feat(ui): integrate metadata audit and neutralization flow"
```
