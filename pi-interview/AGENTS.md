# @lnittman/pi-interview

Pi extension: multi-select interview UI after every agent turn. Published to npm as `@lnittman/pi-interview`.

## What it does

After each agent response, pi-interview optionally generates context-aware questions grounded in the current session — files touched, errors encountered, trajectory so far — and presents them as a multi-select + notes UI. The user's selections compose into a structured follow-up message that triggers the next agent turn.

**Mode**: `manual` (default, Ctrl+I to trigger) or `auto` (fires on every `agent_end`).

## Architecture

```
agent_end → TurnContext → project snapshot → model call → questions → multi-select UI → sendMessage
                ↓                                              ↕
        trajectory extraction                    state persistence (appendEntry)
        session depth analysis
        agent context enrichment
```

### Core modules

| Module | Purpose | Lines |
|--------|---------|-------|
| `src/index.ts` | Extension entry — events, commands, Ctrl+I shortcut, message renderer | |
| `src/core/signals.ts` | Build `TurnContext` from agent messages + branch history | 217 |
| `src/core/agent-context.ts` | Enrich with session depth, available commands/tools | 255 |
| `src/core/project-context.ts` | `ProjectSnapshot` from cwd (package.json, git branch) | 111 |
| `src/core/trajectory.ts` | Extract session trajectory + file touchpoints from branch | 77 |
| `src/core/state.ts` | Usage tracking, backoff logic, persistence | 93 |
| `src/core/types.ts` | `TurnContext`, `QuizConfig`, `DEFAULT_CONFIG` | 102 |
| `src/core/demo.ts` | Canned demo scenarios for `/interview demo` | 126 |
| `src/adapters/model-client.ts` | Wraps `completeSimple` for question generation | 181 |
| `src/prompts/interview-template.ts` | Prompt composition for the question-generation call | 111 |
| `src/prompts/compose-template.ts` | Template for composing user selections into reply | 57 |
| `src/ui/interview-ui.ts` | TUI multi-select + notes widget (pi-tui Input) | 312 |
| `src/ui/settings-ui.ts` | Settings menu (model, mode, maxQ, maxOpts) | 191 |

### Peer dependencies

- `@mariozechner/pi-agent-core` — extension API surface
- `@mariozechner/pi-ai` — `completeSimple` for question generation
- `@mariozechner/pi-coding-agent` — `ExtensionContext`, markdown theme
- `@mariozechner/pi-tui` — `Input`, `Key`, `truncateToWidth`

## Commands

| Command | Action |
|---------|--------|
| `/interview` or `/interview ask` | Trigger manually |
| `/interview settings` | Open settings menu |
| `/interview demo [build\|error\|aborted\|questions]` | Test with canned scenarios |
| `/interview status` | Show config + usage stats |
| `/interview reset` | Clear state |
| `/interview config <key> <value>` | Set config (mode, model, maxQuestions, maxOptions, skip, instruction) |
| `Ctrl+I` | Shortcut (requires CSI-u / Kitty keyboard protocol) |

## Development

```bash
cd ~/Developer/pi-packages/pi-interview
npm install          # install peer deps
npm run build        # tsc -p tsconfig.build.json
npm test             # build + node --test test/*.test.mjs
npm run typecheck    # tsc --noEmit (strict)
```

## Publishing

Published via the `pi-packages` GitHub Actions workflow on push to main. Version in `package.json` controls whether npm sees a new release.
