# Lessons Learned - Privacy Vault

- **Canvas Redraw**: The primary method for stripping metadata in the browser. It is destructive and "blunt," effectively creating a new image without non-visual data.
- **Detection Gap**: Canvas redraw is passive. For a "Precision UI," we must actively parse the original file (using `exifreader`) before the scrub to show what is being removed.
- **Action flow**: Splitting the "Upload" from "Scrub" (Neutralize) creates a more deliberate, high-value user experience.
