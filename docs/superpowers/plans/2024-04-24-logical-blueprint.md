# Privacy Vault — Logical Blueprint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the core logic for metadata inspection and batch processing within a high-rigidity industrial UI framework.

**Architecture:** A centralized Zustand store manages the lifecycle of multiple files (Idle -> Inspecting -> Cleaned). Processing logic is decoupled into pure utility functions for EXIF parsing and ZIP bundling. The UI is composed of logical "Slots" that will later be populated by the Industrial Privacy design.

**Tech Stack:** Next.js, Zustand, ExifReader (added), JSZip (added).

---

### Task 1: Setup Core State and Types

**Files:**
- Create: `src/types/vault.ts`
- Create: `src/hooks/useVaultStore.ts`

- [ ] **Step 1: Define logical types for the vault lifecycle.**

```typescript
// src/types/vault.ts
export type FileStatus = 'IDLE' | 'INSPECTING' | 'CLEANED' | 'ERROR';

export interface MetadataReport {
  gps: { lat: number; lng: number } | null;
  camera: { make?: string; model?: string } | null;
  software?: string;
  timestamp?: string;
  rawCount: number;
}

export interface VaultFile {
  id: string;
  file: File;
  status: FileStatus;
  report: MetadataReport | null;
  cleanedBlob: Blob | null;
  error?: string;
}
```

- [ ] **Step 2: Create the Zustand store to manage the batch queue.**

```typescript
// src/hooks/useVaultStore.ts
import { create } from 'zustand';
import { VaultFile, FileStatus } from '../types/vault';

interface VaultState {
  queue: VaultFile[];
  addFiles: (files: File[]) => void;
  updateFileStatus: (id: string, status: FileStatus, data?: Partial<VaultFile>) => void;
  removeFile: (id: string) => void;
  clearQueue: () => void;
}

export const useVaultStore = create<VaultState>((set) => ({
  queue: [],
  addFiles: (files) => set((state) => ({
    queue: [...state.queue, ...files.map(f => ({
      id: Math.random().toString(36).substr(2, 9),
      file: f,
      status: 'IDLE',
      report: null,
      cleanedBlob: null
    }))]
  })),
  updateFileStatus: (id, status, data) => set((state) => ({
    queue: state.queue.map(f => f.id === id ? { ...f, status, ...data } : f)
  })),
  removeFile: (id) => set((state) => ({
    queue: state.queue.filter(f => f.id !== id)
  })),
  clearQueue: () => set({ queue: [] })
}));
```

- [ ] **Step 3: Commit.**

```bash
git add src/types/vault.ts src/hooks/useVaultStore.ts
git commit -m "feat(vault): add core types and zustand store for batch management"
```

---

### Task 2: Metadata Inspection Logic

**Files:**
- Create: `src/lib/exif.ts`
- Modify: `package.json`

- [ ] **Step 1: Install ExifReader.**

Run: `npm install exifreader`

- [ ] **Step 2: Implement the inspection utility.**

```typescript
// src/lib/exif.ts
import ExifReader from 'exifreader';
import { MetadataReport } from '../types/vault';

export async function inspectFile(file: File): Promise<MetadataReport> {
  const tags = await ExifReader.load(file);
  const report: MetadataReport = {
    gps: tags['GPSLatitude'] && tags['GPSLongitude'] ? {
      lat: tags['GPSLatitude'].description as any,
      lng: tags['GPSLongitude'].description as any
    } : null,
    camera: {
      make: tags['Make']?.description,
      model: tags['Model']?.description
    },
    software: tags['Software']?.description,
    timestamp: tags['DateTimeOriginal']?.description || tags['DateTime']?.description,
    rawCount: Object.keys(tags).length
  };
  return report;
}
```

- [ ] **Step 3: Commit.**

```bash
git add package.json src/lib/exif.ts
git commit -m "feat(vault): implement EXIF inspection utility"
```

---

### Task 3: Logical UI Composition (Slots)

**Files:**
- Create: `src/components/Vault/VaultRoot.tsx`
- Create: `src/components/Vault/ControlPanel.tsx` (Logical Slot)
- Create: `src/components/Vault/InspectionViewport.tsx` (Logical Slot)

- [ ] **Step 1: Define the Root layout with logical slots.**

```tsx
// src/components/Vault/VaultRoot.tsx
import { ControlPanel } from './ControlPanel';
import { InspectionViewport } from './InspectionViewport';

export function VaultRoot() {
  return (
    <div className="vault-root-logical-container">
      <div className="slot-sidebar">
        <ControlPanel />
      </div>
      <div className="slot-main">
        <InspectionViewport />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Implement ControlPanel logic (Upload handling).**

```tsx
// src/components/Vault/ControlPanel.tsx
import { useVaultStore } from '../../hooks/useVaultStore';

export function ControlPanel() {
  const addFiles = useVaultStore(state => state.addFiles);
  
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files));
  };

  return (
    <section>
      <input type="file" multiple onChange={onFileChange} />
      {/* Logical button for trigger processing later */}
    </section>
  );
}
```

- [ ] **Step 3: Implement InspectionViewport logic (Queue display).**

```tsx
// src/components/Vault/InspectionViewport.tsx
import { useVaultStore } from '../../hooks/useVaultStore';

export function InspectionViewport() {
  const queue = useVaultStore(state => state.queue);

  return (
    <section>
      {queue.map(item => (item.id && (
        <div key={item.id}>
          <span>{item.file.name}</span>
          <span>{item.status}</span>
          {item.report && <div>Tags found: {item.report.rawCount}</div>}
        </div>
      )))}
    </section>
  );
}
```

- [ ] **Step 4: Commit.**

```bash
git add src/components/Vault/
git commit -m "feat(vault): add logical UI containers and slots"
```

---

### Task 4: Batch Processing & ZIP Logic

**Files:**
- Create: `src/lib/zip.ts`
- Modify: `package.json`

- [ ] **Step 1: Install JSZip.**

Run: `npm install jszip`

- [ ] **Step 2: Implement ZIP generation utility.**

```typescript
// src/lib/zip.ts
import JSZip from 'jszip';

export async function generateBatchZip(files: { name: string, blob: Blob }[]): Promise<Blob> {
  const zip = new JSZip();
  files.forEach(f => zip.file(f.name, f.blob));
  return await zip.generateAsync({ type: 'blob' });
}
```

- [ ] **Step 3: Integrate processing loop in a hook or component.**
- [ ] **Step 4: Commit.**

```bash
git add package.json src/lib/zip.ts
git commit -m "feat(vault): implement batch ZIP generation"
```
