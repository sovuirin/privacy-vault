# AGENTS.md — Constitutional Master (v5.1)

Read: @WORKING-CONTEXT.md (state), @TASKS.md (queue), @CONVENTIONS.md (patterns).

## Session
- Open: run `/session-handoff` (automatic).
- During: update living docs incrementally after each task, error, or decision.
- **Log-Before-Verify**: In any build/fix cycle, you are FORBIDDEN from running a second verification attempt if a previous failure has not been documented in `ERROR-LEDGER.md`.
- **Immediate Logging**: Every architectural change or non-obvious choice MUST be logged using `bash scripts/log_decision.sh arch ...` before the task is closed.

## Workflows
| Command | What it does |
|---------|-------------|
| `/session-handoff` | Session open/close |
| `/ideation` | Phase 1-3: idea → BRIEF → SPEC → TASKS |
| `/build` | Phase 4-6: code → QA → deploy |
| `/qa` | Phase 5-6: test → harden → deploy |
| `/project-intake` | Onboard existing material |
| `/market-validation` | Evidence pipeline: sources -> signal scoring -> guardrails |
| `/validation-signals` | Extract and score UX-friction complaints |
| `/validation-handoff` | Convert validation signals into SPEC constraints |
| `/phase-gate` | Validate phase readiness checklist (PASS/FAIL) |
| `/feature` | Inline planning for post-MVP features |
| `/fix` | Bug fix → diagnose → fix → verify → log |
| `/inject` | Process external input into docs |
| `/archive` | Move completed items to archive/ |

## Directives
### Deterministic Documentation
- **Fresh-Audit Rule**: Architect MUST call `view_file` on target lines within 1-2 turns of a `replace` call for living docs if scripts fail.
- **Script-First Sync**: ALL changes to `TASKS.md` checkboxes must go through `bash scripts/mark_task.sh`. Manual editing of checkmarks is forbidden.
- **Atomic Doc Sync**: Sync docs via `bash scripts/sync_context.sh` after every completed task or worker run.

### Traceability & Auditability
- **Visual-First Mandate**: Architect is FORBIDDEN from delegating coding tasks to `opencode` for any feature that lacks a corresponding high-fidelity Stitch screen. Visuals are binding SPEC constraints. Every Epic MUST have a tagged visual artifact in our Stitch Source of Truth (SSOT) before implementation begins.
- **Atomic Commits**: Run `bash scripts/commit.sh "<type>(<scope>): <message>"` after every completed task.
- **Mandatory Scopes (OS v5.0)**: ALL commits must include a scope in parentheses (e.g., `feat(kernel)`). Commits missing a scope will be rejected by the gatekeeper.
- **Task Inference**: The OS automatically marks tasks as verified `[✓]` in `TASKS.md` based on your commit scope.
- **Orchestration Protocol**: The Architect (Antigravity) NEVER writes implementation code inline. ALL coding tasks are delegated to `opencode` workers via `opencode run "[Prompt Spec]"`.

## Safety & Environment Guards
- **Zero-Trust Destructive Guard**: Agents are FORBIDDEN from performing any destructive action (e.g., `rm -rf` outside `scratch/`, `supabase db reset`, `git push --force`) without explicit user approval.
- **Cloud Environment Gate**: Agents are FORBIDDEN from executing commands that modify remote/linked cloud services (e.g., `supabase db push`, `npm publish`, `vercel --prod`) without explicit user approval.
- **Local-First Mandate**: ALL infrastructure, schema, or configuration changes MUST be verified and pass on the local environment (e.g., local Supabase/Docker) before any cloud-bound task is even considered.
- **Approval Protocol**: For any guarded or destructive action, the user MUST include the exact string `[APPROVED]` in their request. Commands executed without this specific flag are a constitutional violation.

---
**Template Version**: 5.1
**Project**: privacy-vault
**Last Updated**: 2026-04-20
