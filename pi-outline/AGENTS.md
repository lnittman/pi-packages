# @lnittman/pi-outline (private)

Pi extension: AST-based code structure tools inside agent sessions.

Wraps `@lnittman/outline` as a pi command surface. Not published — private extension for local use.

## Commands

| Command | What |
|---------|------|
| `/outline [path]` | Generate YAML outline of functions, classes, types, imports |
| `/outline --search pattern` | Find symbols matching regex |
| `/outline --diff HEAD~1` | Show changed symbols since ref |
| `/outline --stats` | File/symbol/language summary dashboard |
| `/outline --callers sym` | Find all call sites of a symbol |
| `/outline --tree` | Directory tree with per-folder stats |
| `/outline --types func,class` | Filter to specific symbol types |

## Architecture

```
/outline command → parse flags → @lnittman/outline lib → format → pi sendMessage (markdown)
```

Lazy-loads `@lnittman/outline` on first use. All rendering goes through pi's markdown renderer.

## Install

```bash
# In pi settings.json, add to extensions:
"@lnittman/pi-outline"
```

Requires `@lnittman/outline` to be installed (globally or in the pi environment).
