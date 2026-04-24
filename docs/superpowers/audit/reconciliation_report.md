# Phase 4 Audit: Privacy Vault (Logic vs. Visuals)

**Audit Date:** 2026-04-24
**Artifacts:** `dashboard_v2.png`, `Logical Blueprint (docs/superpowers/plans/2024-04-24-logical-blueprint.md)`

---

## 1. Parity Analysis

| Feature | Plan (Logical) | Visual (Artifact) | Status | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Metadata Fields** | GPS, Camera, Software, Timestamp | Audit Matrix: TAG_ID, PROPERTY, VALUE [HEX_OFFSET] | ⚠️ MISMATCH | Expand `MetadataReport` interface to support dynamic forensic tags. |
| **Lifecycle** | IDLE -> INSPECTING -> CLEANED | Terminal logs showing "STRIPPING_GPS..." | ✅ ALIGNED | Logical state maps to visual progress. |
| **Core Layout** | Split View (Sidebar/Main) | Split View (300px sidebar) | ✅ ALIGNED | Matches requested structure. |
| **Design DNA** | Industrial, Geist Mono, 0px rounding | Square corners, 1px borders, Monospace | ✅ ALIGNED | Strict adherence to .stitch/DESIGN.md. |
| **Risk Metrics** | Privacy Score (0-100) | RISK_INDEX (84/100) + Violation Flags | ⚠️ ENHANCED | Update logic to calculate forensic violation flags. |

## 2. Reconciliation Decisions

1.  **Dynamic Metadata**: The `MetadataReport` type will be updated to include a `signals` array of objects (TAG_ID, Name, Value, Offset) to match the high-density "Audit Matrix" visual.
2.  **Forensic Flags**: Add a `ViolationFlag` type to the logic to drive the "Threat Assessment" UI section.
3.  **Terminal Log State**: Introduce a `logs: string[]` field to the `VaultFile` state to drive the bottom terminal log component.

## 3. Verified Construction Todo (The Contract)

- [ ] **Task 1: Core State Refinement**
    - Update `src/types/vault.ts` with enhanced `MetadataReport` and `ViolationFlag` types.
- [ ] **Task 2: UI Implementation (Atomic)**
    - Implement `AuditMatrix` component with strict 1px borders and Geist Mono.
    - Implement `RiskIndex` display with Risk Rose (#F43F5E) color logic.
- [ ] **Task 3: Integration**
    - Map `useVaultStore` state changes to the terminal log component.
