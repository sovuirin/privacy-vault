# Lessons Learned - Privacy Vault

- **Canvas Redraw**: The primary method for stripping metadata in the browser. It is destructive and "blunt," effectively creating a new image without non-visual data.
- **Detection Gap**: Canvas redraw is passive. For a "Precision UI," we must actively parse the original file (using `exifreader`) before the scrub to show what is being removed.
- **Action flow**: Splitting the "Upload" from "Scrub" (Neutralize) creates a more deliberate, high-value user experience.
- **Orchestration Constraint**: Recursive subagent dispatching (a subagent calling `invoke_agent`) and subagents entering `plan_mode` lead to critical failures. Subagents lack the meta-orchestration permissions and the context to handle these states, resulting in unauthorized tool calls or deadlocks.
- **Explicit Tool Mapping**: Controllers (main agents) must explicitly map available tools (e.g., `read_file`, `run_shell_command`) and forbid restricted ones (e.g., `invoke_agent`, `enter_plan_mode`) in the subagent's task description to ensure execution boundaries are clear.
- **Execution Traces**: Every task must generate a detailed trace in `docs/superpowers/traces/` to support RCA and self-healing. If a task requires excessive effort or review loops, update the relevant prompt or design spec immediately.
- **ExifReader Precision**: `ExifReader.load(file)` provides high-signal metadata. Accessing tags via `.description` ensures we get human-readable values rather than raw binary or numeric data.

# ANTIGRAVITY

## 1. Naming Hygiene & Runtime Resolution
- **RCA - Module Resolution Crash**: Exporting an interface and a component with the same name (e.g., `MetadataAudit`) in the same dependency tree causes Webpack/Next.js to fail at runtime with `__webpack_modules__[moduleId] is not a function`.
- **Mitigation**: Strictly enforce semantic suffixes for data models and interfaces (e.g., `ForensicReport`, `AuditProps`). Components should maintain unique identity.
- **Verification**: Runtime smoke tests (e.g., Playwright) are mandatory for every refactor to verify page hydration and module resolution beyond "it builds".

## 2. Visual-First Mandate (Reconciled Loop)
- **Binding Source of Truth**: The Stitch visual artifact is the binding specification. Implementation is not complete until it passes a side-by-side audit against the SSOT (e.g., `dashboard_v2.png`).
- **Audit Mismatch**: The initial `MetadataAudit.tsx` implementation missed granular forensic fields (TAG_ID, HEX_OFFSET) and numeric risk indices identified in the Phase 4 Reconciliation Report.
- **Protocol**: Mandate visual audits in the `requesting-code-review` skill to prevent "logic-only" completions.

## 3. Planning Rigor & Testing
- **Test-First Planning**: All implementation plans MUST include exact test commands and verification scenarios (e.g., uploading an image with GPS data to trigger specific UI states).
- **Skill Hardening**: The `writing-plans` and `requesting-code-review` skills have been hardened to enforce visual references and runtime verification steps.

## 4. Shell-Module Reciprocity
- **Global Design Integrity**: Implementing a high-fidelity module (e.g., `MetadataAudit`) in a default or "consumer-style" shell violates the visual mandate. The application shell (Sidebars, Terminal, Header) must match the design system's rigidity to provide proper context.
- **Theme Precedence**: Industrial themes (Monospace, 0px rounding, high-density grids) change spatial requirements. Codifying these tokens in `globals.css` BEFORE building features prevents layout-breaking refactors.

## 5. Dashboard Forensic Verification
- **Full-Spectrum Audits**: Verification must capture the ENTIRE dashboard state (Sidebar + Header + Main Content + Terminal). Registry or layout regressions in the "shell" are as critical as bugs in the core module.
- **Verification Evidence**: High-resolution, full-page screenshots are the required evidence for "Visual-First" completion.

