# Bierpongregeln — Agent Reference

A static Next.js website for beer pong rules and tournament tools. German-language, public, primarily used by a friend community.

## Key Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Production build | `pnpm build` |
| Type check | `pnpm run typecheck` |
| Lint (CI mode) | `pnpm exec biome ci --error-on-warnings` |
| Lint + fix | `pnpm run check:fix` |
| Format | `pnpm run format` |

All three CI checks must pass before merging: `biome ci`, `typecheck`, `build`.

## Project Structure

```
src/
  app/                  # Next.js App Router pages
    flavor/[slug]/      # Dynamic ruleset pages (server-rendered articles + client islands)
    tournament-generator/
    tournament-results/
    coming-soon/
    globals.css         # Design tokens (light/dark), type scale, keyframes, base styles
  components/
    ui/                 # shadcn/ui primitives (Radix), restyled via tokens
    composites/         # App-specific composed components
      rules/            # Rule articles, TOC, section chips, search + scroll-spy islands
      tournament-results/
      tournament-generator/
    types/              # Shared TypeScript types (ruleset.types.ts)
  lib/
    navigation.ts       # Nav items (labels, icons, active-route matching), flavor list
    ruleset-loader.ts   # Loads and merges ruleset data
    ruleset-view.ts     # Reference map, TOC and search text for rendering rulesets
    search.ts           # Search text normalization (umlauts, accents)
    theme.ts            # Theme init script + toggle helpers
    tournament-utils.ts # Ranking (score calculation) and tournament helpers
    utils.ts            # cn() helper
  data/
    rulesets/           # One file per ruleset (regelwerk, moritz, felix, …)
```

## Code Conventions

- **Linter/Formatter**: Biome — 4-space indent, 100-char line width, LF line endings, double quotes
- **TypeScript**: strict mode, path alias `@/*` → `src/*`
- **Commits**: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `build:`, `docs:`)
- **Package manager**: pnpm (v11)
- **Styling**: Tailwind CSS v4 via `@tailwindcss/postcss` — no `tailwind.config.ts` needed
- **Components**: shadcn/ui primitives on individual `@radix-ui/*` packages — don't mix in the umbrella `radix-ui` package or another component library
- **Icons**: `lucide-react`

## Design System

The design tokens live in `src/app/globals.css`. In short:

- **Colors**: logo-derived tokens in `globals.css` (`:root` light, `.dark` dark) exposed as Tailwind colors (`bg-primary`, `bg-accent`, `bg-coral`, `text-coral-ink`, …). Coral and brand teal are decorative only, never text.
- **Type**: Bricolage Grotesque; use the text tokens (`text-title`, `text-label`, `text-card-title`, `text-rule`, … with `-lg` variants) instead of arbitrary sizes. Numbers use `tabular-nums`.
- **Theme**: inline script in `<head>` (`lib/theme.ts`) applies `.dark` before paint; `ThemeToggle` persists the choice in `localStorage`.
- **Layout**: mobile first; bottom tab bar below `md`, sticky header from `md`, sidebars from `lg`. Touch targets ≥ 44 px.
- **Motion**: Tailwind transitions and `tw-animate-css`, wrapped in `motion-safe:`; reduced motion is respected globally.

## Rulesets

The base ruleset is `regelwerk`. All other flavors extend it via `baseRulesetSlug`. `getMergedRuleset(slug)` in `ruleset-loader.ts` handles the merge. Available slugs: `regelwerk`, `moritz`, `felix`, `marcel`, `game-pigeon`, `3d`, `mehr-baelle`, `sniper`, `double-table`.

Each ruleset can have a `summary`: a few short bullets shown in the "Kurz erklärt" card at the top of its page. It is not inherited, so flavors list only their differences to the base ruleset. Bullets use the same markup as paragraphs (e.g. `<strong>` for keywords).

## Tournament Results

Results live in `tournaments.json` (schema: `tournaments.schema.json`). `pnpm run data-consistency-check` validates them and runs in CI.

Each tournament has `date`, `flavor`, `type` (`single` or `team`), `gamesToWin`, `firstPlace`, `secondPlace`, `thirdPlace` and `participants`. Every placed name must also be listed in `participants`. In team tournaments, list both players of a placed team; each gets the full points.

`gamesToWin` is the number of games the tournament winner played up to and including the final, wins and losses alike (a 4-1 record is 5 games). For team tournaments, count the winning team's games.

The ranking is computed per board (team, single) by `getBoardScoring()` in `tournament-utils.ts`; all parameters are in its `scoring` object:

- **Points**: 1 per participation plus podium points (`rating`: 15/8/3) × tournament coefficient. The coefficient is `ln(gamesToWin) / ln(median gamesToWin of the board)`, so the median tournament counts 1.0× and the reference moves as tournaments are added.
- **Form**: points per participation compared with the board average, with 2 average tournaments added to every player (shrinkage) and an exponent of 0.8.
- **Activity**: 0.9 per missed tournament day after the first 2; several tournaments on one date count as one day.
- **Score** = points × form × activity. Players with fewer than `QUALIFIED_MIN_PARTICIPATIONS` (3) participations are listed but not ranked.

The "Berechnung im Detail" dialog (`components/composites/tournament-results/score-explanation.tsx`) shows the formulas and a per-player breakdown. It reads its numbers from the same calculation, so parameter changes need no text changes there.

## What Requires Approval

- Pushing to remote
- Destructive git operations (`reset --hard`, `push --force`, `clean`)
- Changing CI/CD workflows
- Adding new dependencies

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines and the [issue templates](.github/ISSUE_TEMPLATE/) for reporting bugs or suggesting features.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
