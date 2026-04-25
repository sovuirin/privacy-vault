# Lessons Learned - Privacy Vault

- **Canvas Redraw**: The primary method for stripping metadata in the browser. It is destructive and "blunt," effectively creating a new image without non-visual data.
- **Detection Gap**: Canvas redraw is passive. For a "Precision UI," we must actively parse the original file (using `exifreader`) before the scrub to show what is being removed.
- **Action flow**: Splitting the "Upload" from "Scrub" (Neutralize) creates a more deliberate, high-value user experience.
- **Orchestration Constraint**: Recursive subagent dispatching (a subagent calling `invoke_agent`) and subagents entering `plan_mode` lead to critical failures. Subagents lack the meta-orchestration permissions and the context to handle these states, resulting in unauthorized tool calls or deadlocks.
- **Explicit Tool Mapping**: Controllers (main agents) must explicitly map available tools (e.g., `read_file`, `run_shell_command`) and forbid restricted ones (e.g., `invoke_agent`, `enter_plan_mode`) in the subagent's task description to ensure execution boundaries are clear.
- **Execution Traces**: Every task must generate a detailed trace in `docs/superpowers/traces/` to support RCA and self-healing. If a task requires excessive effort or review loops, update the relevant prompt or design spec immediately.
- **ExifReader Precision**: `ExifReader.load(file)` provides high-signal metadata. Accessing tags via `.description` ensures we get human-readable values rather than raw binary or numeric data.
