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
    flavor/[slug]/      # Dynamic ruleset pages
    tournament-generator/
    tournament-results/
    coming-soon/
  components/
    ui/                 # shadcn/ui primitives
    composites/         # App-specific composed components
    types/              # Shared TypeScript types (ruleset.types.ts)
  lib/
    navigation.ts       # Sidebar/nav structure
    ruleset-loader.ts   # Loads and merges ruleset JSON data
    tournament-utils.ts # Tournament format calculation logic
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
- **Components**: shadcn/ui (new-york style, slate base color)

## Rulesets

The base ruleset is `regelwerk`. All other flavors extend it via `baseRulesetSlug`. `getMergedRuleset(slug)` in `ruleset-loader.ts` handles the merge. Available slugs: `regelwerk`, `moritz`, `felix`, `marcel`, `game-pigeon`, `3d`, `mehr-baelle`, `sniper`, `double-table`.

## What Requires Approval

- Pushing to remote
- Destructive git operations (`reset --hard`, `push --force`, `clean`)
- Changing CI/CD workflows
- Adding new dependencies

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines and the [issue templates](.github/ISSUE_TEMPLATE/) for reporting bugs or suggesting features.
