# Changelog

## 0.12.1

- Default mode is manual — Ctrl+I or `/interview` to trigger
- No more auto-firing after every agent turn
- Injected available commands and active tools into agent context
- `/interview config mode auto` to re-enable if desired

## 0.12.0

- Agentic prompt — no archetypes, no situation matching, let sonnet reason
- Structured sendMessage content: selections joined with "Then", notes with "Note:"
- Portable test paths (no hardcoded directories)
- Richer prompt rules: reference trajectory, suggest skills, skip when obvious

## 0.11.1

- Restored Ctrl+I shortcut (safe with CSI-u/Kitty protocol)

## 0.11.0

- Stripped all prompt archetypes and template logic
- Removed Ctrl+I shortcut (was stealing Tab from vim — fixed in 0.11.1)
- Markdown answer renderer via getMarkdownTheme + Markdown component

## 0.10.0

- pi-tui Input component for notes (full cursor, Ctrl+A/E, word nav, undo, paste)
- Situation-aware prompt archetypes (later removed in 0.11.0)

## 0.9.2

- Strip Kitty keyboard protocol (CSI-u) sequences from note input

## 0.9.1

- Strip arrow key escape sequences from note input

## 0.9.0

- Slate-fill note input (no borders, filled background)

## 0.8.1

- Bordered note input, compact answer renderer

## 0.8.0

- Session trajectory extraction (condensed prior turn summaries)
- All-session-files context (cross-turn file awareness)
- Bracketed paste marker stripping

## 0.7.2

- Paste support + line wrapping in notes

## 0.7.1

- Escape enters notes mode (terminal-universal trigger)

## 0.7.0

- Ask-deep prompt quality: archetypes, depth calibration, grounding rules
- Session depth extraction (early/mid/deep)
- Scrubbed all personal project refs from source

## 0.6.4

- Escape is no-op, only q dismisses

## 0.6.3

- Notes on 'i' key, Unicode fix for Option+comma/period, custom message renderer

## 0.6.2

- Enter/Space toggle checkbox, Tab confirms and advances

## 0.6.1

- Controller-safe dismiss, Alt key bindings

## 0.6.0

- Controller-ergonomic UI, settings menu, enriched context + prompt

## 0.5.2

- Notes mode on 'i' key

## 0.5.1

- Enter key leak fix, sonnet default, widget key cleanup

## 0.5.0

- Agent context from ~/.agents (rules, skills, projects, roles)

## 0.4.1

- truncateToWidth on every render line (crash fix), quiz→interview strings

## 0.4.0

- Renamed to pi-interview, multi-select + notes UI based on ask-user patterns
