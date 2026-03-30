# pi-packages/ — Pi Ecosystem Extensions

Public Pi extension packages. Published to npm under `@lnittman/` scope.

## Packages

| Package | Version | Purpose |
|---------|---------|---------|
| `@lnittman/pi-interview` | 0.12.1 | Multi-select + notes interview UX after agent turns |

## pi-interview

A Pi extension that provides structured prompting after every agent turn — multiple-choice questions with notes, session trajectory awareness, and controller-ergonomic UI.

### Install

```bash
npm install @lnittman/pi-interview
```

### Peer Dependencies

- `@mariozechner/pi-agent-core`
- `@mariozechner/pi-ai`
- `@mariozechner/pi-coding-agent`
- `@mariozechner/pi-tui`

### Test

```bash
cd pi-interview && npm run build && node --test test/*.test.mjs
```
