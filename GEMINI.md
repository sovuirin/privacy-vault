# Gemini CLI Project Policy

This document establishes the foundational mandates and workflows. All agents operating in this workspace MUST adhere to these policies.

## 1. Core Mandate: Compound Engineering (CE)

We operate under a **Compound Engineering** framework. Work is never "disposable." Every task must contribute to the long-term leverage of the "Agentic OS."

- **Mandatory Telemetry:** Every completed task must generate an execution trace in `docs/superpowers/traces/`.
- **Self-Healing Loop:** After every task, perform a Root Cause Analysis (RCA). If the agent struggled, immediately patch the relevant prompt or design spec.
- **Persistent Memory:** Key technical lessons must be saved to `docs/superpowers/LESSONS.md` and injected into the context of subsequent tasks.
- **Subagent-Driven Development (SDD):** All implementation work MUST use the upgraded `subagent-driven-development` skill with Phase 4 enforcement.

## 2. Workspace Conventions

- **Source of Truth:** The active implementation plan in `docs/superpowers/plans/` is the authoritative tracker for progress.
- **Phase Marker:** `.antigravity/working_phase.md` indicates the high-level project stage.
- **Shared Architecture:** Next.js applications (`apps/`) share types and database logic via `packages/`.

## 3. Subagent Orchestration

Map generic task instructions to these specialized experts:
- **`generalist`**: Implementation, testing, and refactoring.
- **`codebase_investigator`**: Research, debugging, and analysis.
- **`code-reviewer`**: Spec compliance and quality auditing.

## 4. Git & Commit Standards

- **Semantic Format**: `<type>(<scope>): <summary>` (e.g., `feat(buyer): add auth`).
- **Traceability**: Include `Ref: PX-TY` (Phase X, Task Y) in the commit footer.
- **Why, not What**: Explain the *reasoning* or RCA in the commit body.
- **Surgical Staging**: Explicitly list files in `git add`. **NEVER** use `git add .` or `git commit -a`.
- **Atomic Tasks**: Commit exactly one task at a time.