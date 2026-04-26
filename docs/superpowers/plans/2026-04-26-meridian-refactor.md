# Meridian Sanctuary Refactor: Logical Blueprint

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the forensic metadata logic and component architecture to support the "Meridian Sanctuary" editorial flow, introducing the "Detailed Audit" visibility state and standardized forensic data contracts.

**Visual Reference:** Stitch Project: `8849553175735820333`, Screen ID: `e95d1ef726804ccaa5327e9f09134b58` (Reference for the "Horizon Line" and "Forensic Matrix" logic).

**Architecture:**## Proposed Changes

The refactor will move the application from a high-density table-based view to a **"Solar Atelier" Bento-Grid** architecture.

### [UI] [The Meridian Sanctuary Components]

#### [MODIFY] [TopAppBar.tsx](file:///home/soverwatch/privacy-vault/src/components/TopAppBar.tsx)
- **Design**: Centralized "Horizon" layout. Glassmorphic (#fbf9f1/80).
- **Navigation**: Tool switcher in center (TERMINAL, VAULT, MONITOR).
- **Logic**: Active tool state management. Sticky positioning.

#### [DELETE] [SideNavBar.tsx](file:///home/soverwatch/privacy-vault/src/components/SideNavBar.tsx)
- **Action**: Completely remove sidebar references to simplify the mental model.

#### [MODIFY] [ForensicMatrix.tsx](file:///home/soverwatch/privacy-vault/src/components/ForensicMatrix.tsx)
- **Change**: Centered editorial bento grid. 
- **Refinement**: Increase padding and whitespace between cards. Ensure "user-friendly" labels (e.g., "Shield Integrity" instead of "Binary Hash Offset").
- **Items**:
    - **Encryption Depth**: Large card with linear progress bar.
    - **Network Nodes**: Interactive node cluster.
    - **Active Shields**: Status pill list.
- **Logic**: Maintain `ForensicReport` data mapping.

#### [NEW] [RiskScoreHero.tsx](file:///home/soverwatch/privacy-vault/src/components/RiskScoreHero.tsx)
- **Design**: Asymmetrical layout, large circular score visualization.
- **Logic**: Animation on score change.

### [Data] [Refinement]
- **State**: Introduce `isMatrixExpanded` boolean to manage the "Optional Density" request.
- **Model**: No changes to `ForensicReport` types.

---

## Verification Plan

### Automated Tests
- `npm run test` (Vitest)
- `npx playwright test` (Visual smoke test for Meridian tokens)

**Tech Stack:** Next.js 15, TypeScript, Lucide React (Icons).

---

### Task 1: Standardize Forensic Data Models

**Files:**
- Modify: `src/lib/metadata.ts`

- [ ] **Step 1: Update Signal and ForensicReport interfaces**
Ensure they match the reconciled SPEC.md exactly, adding the `isHighRisk` and `hexOffset` properties.

```typescript
export interface Signal {
  id: string;
  tagId?: string;
  label: string;
  value: string;
  hexOffset?: string;
  category: 'location' | 'device' | 'origin' | 'sensitive';
  isHighRisk?: boolean;
}

export interface ForensicReport {
  riskLevel: 'low' | 'medium' | 'high';
  riskScore: number;
  signals: Signal[];
  violationFlags: string[];
}
```

- [ ] **Step 2: Verify type consistency in `detectMetadata` function**
Update the return type of `detectMetadata` to explicitly use `ForensicReport`.

- [ ] **Step 3: Commit**
```bash
git add src/lib/metadata.ts
git commit -m "feat(forensic): standardize ForensicReport and Signal interfaces"
```

---

### Task 2: Implement "Detailed Audit" State in Scrubber Hook

**Files:**
- Modify: `src/hooks/useImageScrubber.ts`

- [ ] **Step 1: Add `showDetails` state to the hook**
```typescript
const [showDetails, setShowDetails] = useState(false);
const toggleDetails = () => setShowDetails(prev => !prev);
```

- [ ] **Step 2: Export `showDetails` and `toggleDetails` in the hook return**
Update the `useImageScrubber` return type to include these new members.

- [ ] **Step 3: Commit**
```bash
git add src/hooks/useImageScrubber.ts
git commit -m "feat(scrubber): add visibility toggle state for detailed audit"
```

---

### Task 3: Refactor MetadataAudit Component for Logic Isolation

**Files:**
- Modify: `src/components/MetadataAudit.tsx`
- Create: `src/components/ForensicMatrix.tsx`

- [ ] **Step 1: Extract Rendering Logic to `ForensicMatrix`**
Create a new component that accepts `report: ForensicReport` as a prop. For now, it will just render a simple list (no styling).

```tsx
import { ForensicReport } from '@/lib/metadata';

interface ForensicMatrixProps {
  report: ForensicReport;
}

export const ForensicMatrix = ({ report }: ForensicMatrixProps) => {
  return (
    <div className="space-y-4">
      {report.signals.map((signal) => (
        <div key={signal.id} className="flex justify-between">
          <span>{signal.label}</span>
          <span>{signal.value}</span>
        </div>
      ))}
    </div>
  );
};
```

- [ ] **Step 2: Update `MetadataAudit` to use the toggle state**
Modify `MetadataAudit` to conditionally render `ForensicMatrix` based on the `showDetails` prop (passed from the parent page/hook).

- [ ] **Step 3: Commit**
```bash
git add src/components/MetadataAudit.tsx src/components/ForensicMatrix.tsx
git commit -m "refactor(ui): decouple forensic matrix from audit container"
```

---

### Task 4: Implement Weighted Risk Scoring Logic

**Files:**
- Modify: `src/lib/metadata.ts`

- [ ] **Step 1: Implement the weighted score calculation**
Update `detectMetadata` to calculate `riskScore` based on: `(signals.length * 5) + (highRiskCount * 20)`.

```typescript
const highRiskCount = signals.filter(s => s.isHighRisk).length;
const riskScore = Math.min(100, (signals.length * 5) + (highRiskCount * 20));
```

- [ ] **Step 2: Map score to riskLevel**
Low: <30, Medium: 30-70, High: >70.

- [ ] **Step 3: Commit**
```bash
git add src/lib/metadata.ts
git commit -m "feat(forensic): implement weighted risk scoring algorithm"
```
