# Meridian Sanctuary: Logical Blueprint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the logic for Parallel Batch Mode and the Master-Detail drill-down state management for the Privacy Vault.

**Visual Reference:** Stitch Project: `8849553175735820333`, Screen ID: `3fdb240f918440f0b77e45cad4bd8fb4` (Batch Overview Reference).

**Visual Tokens:**
- **Background**: `Natural Parchment (#FBF9F1)`
- **Surface**: `Sovereign Surface (#FFFFFF)`
- **Accent**: `Sovereign Purple (#5D39E0)` (Gradient: `#5D39E0` to `#7657FA`)
- **Status**: `Sunrise Gold (#705D00)` (Clean), `Risk Rose (#EF4444)` (Threat)
- **Typography**: `Space Grotesk` (Labels/Headlines), `Geist Sans` (Body), `JetBrains Mono` (Data)

**Architecture:** We use a centralized state hook (`useImageScrubber`) to manage the transition between Aggregate and Detail states. Data is normalized into a `BatchFile` collection, and an `AggregatedReport` is computed dynamically.

**Tech Stack:** React 19, TypeScript, Lucide React.

---

### Task 1: Extend Forensic Data Models for Batching

**Files:**
- Modify: `src/lib/metadata.ts`

- [ ] **Step 1: Define BatchFile and AggregatedReport interfaces**
Add these to support the new Parallel Overview logic.

```typescript
export interface BatchFile {
  id: string;
  file: File;
  report: ForensicReport | null;
  status: 'pending' | 'analyzing' | 'detected' | 'neutralizing' | 'neutralized' | 'error';
  isNeutralized: boolean;
}

export interface AggregatedReport {
  totalFiles: number;
  totalHighRiskSignals: number;
  highestRiskScore: number;
  averageRiskScore: number;
  uniqueDeviceModels: string[];
  hasLocationData: boolean;
}
```

- [ ] **Step 2: Commit**
```bash
git add src/lib/metadata.ts
git commit -m "feat(logic): add BatchFile and AggregatedReport interfaces"
```

---

### Task 2: Implement Batch State Management in `useImageScrubber`

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Add batch state and selection logic**
```typescript
const [files, setFiles] = useState<BatchFile[]>([]);
const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

const addFiles = (newFiles: File[]) => {
  const batchEntries = newFiles.map(f => ({
    id: crypto.randomUUID(),
    file: f,
    report: null,
    status: 'pending',
    isNeutralized: false,
  }));
  setFiles(prev => [...prev, ...batchEntries]);
};

const selectFile = (id: string | null) => setSelectedFileId(id);
```

- [ ] **Step 2: Implement `aggregatedReport` memoized calculation**
Calculate the aggregate stats from the `files` array.

- [ ] **Step 3: Commit**
```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(logic): implement batch state management and selection"
```

---

### Task 3: Implement Batch Processing (Analyze & Neutralize All)

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Implement `analyzeBatch` loop**
Iterate through `files`, calling `detectMetadata` for each and updating status.

- [ ] **Step 2: Implement `neutralizeBatch` loop**
Iterate through `files`, calling `scrubImageMetadata` for each.

- [ ] **Step 3: Commit**
```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(logic): add batch analysis and neutralization processing"
```

---

### Task 4: Define Component Interfaces (Logic Only)

**Files:**
- Modify: `src/components/ForensicMatrix.tsx`
- Modify: `src/components/RiskScoreHero.tsx`

- [ ] **Step 1: Update `ForensicMatrix` props**
Add a `mode` prop to switch between 'aggregate' and 'detail' rendering logic.

- [ ] **Step 2: Update `RiskScoreHero` props**
Ensure it accepts a generic `score` and `label` (e.g., "Batch Risk Index" vs "File Risk Score").

- [ ] **Step 3: Commit**
```bash
git add src/components/ForensicMatrix.tsx src/components/RiskScoreHero.tsx
git commit -m "refactor(logic): standardize component interfaces for batch/detail modes"
```
