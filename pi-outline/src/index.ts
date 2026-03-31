/**
 * pi-outline — AST code structure extension for pi.
 *
 * Registers /outline, /diff, /search, /stats commands that wrap
 * @lnittman/outline's library surface and display results in the pi TUI.
 */

import type {
  ExtensionAPI,
  ExtensionContext,
} from "@mariozechner/pi-coding-agent";
import { getMarkdownTheme } from "@mariozechner/pi-coding-agent";
import { Markdown } from "@mariozechner/pi-tui";

// Import outline library functions
// These resolve at runtime from the published @lnittman/outline package
let outlineLib: typeof import("@lnittman/outline") | null = null;

async function getOutlineLib() {
  if (!outlineLib) {
    outlineLib = await import("@lnittman/outline");
  }
  return outlineLib;
}

export default function piOutline(pi: ExtensionAPI) {
  let ctx: ExtensionContext | undefined;

  // Register markdown renderer for outline results
  pi.registerMessageRenderer("pi-outline-result", (message) => {
    const content = typeof message.content === "string" ? message.content : "";
    return new Markdown(content, 0, 0, getMarkdownTheme());
  });

  pi.on("session_start", async (_ev, c) => {
    ctx = c;
  });

  pi.on("session_switch", async (_ev, c) => {
    ctx = c;
  });

  // ─── /outline command ──────────────────────────────────────────────

  pi.registerCommand("outline", {
    description: "outline [path] [--types func,class] [--search pattern] [--stats] [--diff ref] [--callers sym] [--tree]",
    handler: async (args, c) => {
      ctx = c;
      const parts = args.trim().split(/\s+/);
      const flags = parseFlags(parts);
      const paths = flags.positional.length > 0 ? flags.positional : [c.cwd];

      try {
        const lib = await getOutlineLib();

        if (flags.has("tree")) {
          const tree = await lib.buildTree(paths[0]!, { maxDepth: 3 });
          const formatted = lib.formatTree(tree);
          sendResult(c, `\`\`\`\n${formatted}\n\`\`\``);
          return;
        }

        if (flags.has("stats")) {
          const outlines = await lib.generateOutlines(paths, { cwd: c.cwd });
          const stats = lib.computeStats(outlines);
          const formatted = lib.formatStats(stats);
          sendResult(c, `\`\`\`\n${formatted}\n\`\`\``);
          return;
        }

        if (flags.get("search")) {
          const pattern = flags.get("search")!;
          const outlines = await lib.generateOutlines(paths, { cwd: c.cwd });
          const matches = lib.searchSymbols(outlines, pattern);
          const formatted = lib.formatSearchResults(matches);
          sendResult(c, `\`\`\`\n${formatted}\n\`\`\``);
          return;
        }

        if (flags.get("callers")) {
          const symbol = flags.get("callers")!;
          const outlines = await lib.generateOutlines(paths, { cwd: c.cwd });
          const graph = lib.buildCallGraph(outlines);
          const callers = lib.findCallers(graph, symbol);
          const formatted = lib.formatGraphResults(callers, "callers", symbol);
          sendResult(c, `\`\`\`\n${formatted}\n\`\`\``);
          return;
        }

        if (flags.get("diff")) {
          const ref = flags.get("diff")!;
          const diff = await lib.getDiffOutlines(ref, { cwd: c.cwd });
          const formatted = lib.formatDiff(diff, "text");
          sendResult(c, `\`\`\`\n${formatted}\n\`\`\``);
          return;
        }

        // Default: generate outline
        const typesFilter = flags.get("types")?.split(",");
        const outlines = await lib.generateOutlines(paths, {
          cwd: c.cwd,
          types: typesFilter,
        });
        const formatted = lib.formatOutlines(outlines, "yaml");
        sendResult(c, `\`\`\`yaml\n${formatted}\n\`\`\``);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        c.ui.notify(`outline: ${msg.slice(0, 120)}`, "error");
      }
    },
  });

  // ─── Helpers ──────────────────────────────────────────────────────

  function sendResult(c: ExtensionContext, content: string) {
    pi.sendMessage({
      customType: "pi-outline-result",
      content,
      display: true,
    }, { triggerTurn: false });
  }

  function parseFlags(parts: string[]): {
    positional: string[];
    has: (key: string) => boolean;
    get: (key: string) => string | undefined;
  } {
    const positional: string[] = [];
    const flags = new Map<string, string>();

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      if (part.startsWith("--")) {
        const key = part.slice(2);
        const next = parts[i + 1];
        if (next && !next.startsWith("--")) {
          flags.set(key, next);
          i++;
        } else {
          flags.set(key, "true");
        }
      } else if (part) {
        positional.push(part);
      }
    }

    return {
      positional,
      has: (key: string) => flags.has(key),
      get: (key: string) => flags.get(key),
    };
  }
}
