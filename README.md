# Privacy Vault

Privacy Vault helps you clean files before sharing them with other people,
online platforms, or AI tools.

Image metadata cleanup is available now. Screenshot redaction is available in
an early version, and document cleanup is still limited.

## Current Product Status

- `Image Cleaner`: available now
- `Document Cleaner`: beta
- `Screenshot Redactor`: beta

## What Works Today

### Image Cleaner

- Upload one or many images
- Remove EXIF, IPTC, and XMP metadata client-side
- Preview original and cleaned outputs
- Export cleaned files as PNG, JPEG, or WebP
- Keep all processing local to the browser
- Useful before sending images to chatbots, image tools, social apps, or work systems

### Beta Tools

#### Document Cleaner

- PDF cleanup is best-effort for common metadata fields
- Office documents are supported for metadata assessment, but full metadata rewriting is not available yet
- Results explain whether a file was cleaned, only partially handled, or not supported in this build

#### Screenshot Redactor

- Draw blur or blackout boxes directly on a screenshot
- Export a redacted PNG or JPEG locally
- Download a plain-text redaction report

## Privacy Guarantees

- 100% client-side processing
- No server uploads
- No account required
- No analytics or tracking
- Offline-friendly for the mature image-cleaning flow

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
git clone <repository-url>
cd privacy-vault
npm install
npm run dev
```

The development instance is accessible at http://localhost:3000.

## Core Workflow

### Image Cleaner

1. Upload image files
2. Wait for local metadata cleanup
3. Review the success summary and previews
4. Choose export settings
5. Download cleaned files

## Tech Stack

- Next.js 15
- React 18
- TypeScript
- Tailwind CSS

## Development Notes

- The image-cleaning path is the primary product focus
- Screenshot redaction is usable now, while document cleanup still has tighter support boundaries

## Verification

```bash
npm run lint
```

## Important Notes

- Privacy Vault does not upload your files to any server
- Browser limitations still apply for very large files
