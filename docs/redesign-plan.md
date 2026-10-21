# Redesign Plan — "Clean & Bold"

Status: **approved for implementation** · Branch: `feat/redesign` · Design canvas:
<https://claude.ai/artifact/YMrD1kshjxw3LVi1jcM3ji>

This document is the single source of truth for the redesign. Every implementation commit
references a step from [§ 12 Commit plan](#12-commit-plan). If the implementation has to deviate,
update this document in the same commit.

---

## 1. Goals & constraints

| Topic | Decision |
|---|---|
| Primary use | Phone, mid-game, often in a dim room → mobile-first, ≥ 44 px touch targets, fast rule lookup |
| Desktop | Fully supported (top navigation, sidebar TOC, two-column results) |
| Logo | Unchanged (`public/logo.svg`, `src/app/icon.svg`, social images) |
| Content structure | Unchanged — no flavor diff badges, no combinations panel, no new data |
| Home page | Stays minimal (logo, title, tagline) |
| Palette | Only logo hues (teal, coral, cream/gray) plus tints/shades |
| Typography | **Bricolage Grotesque** (variable, `opsz` axis) replaces Geist + Geist Mono |
| Theme | Follows system, manual toggle, persisted in `localStorage` |
| Motion | Subtle; CSS + `tw-animate-css` only; fully disabled under `prefers-reduced-motion` |
| Accessibility | WCAG 2.2 AA contrast for all text pairs (verified, § 3.3), keyboard + screen reader support |
| Language | UI copy stays German |

### 1.1 Library decisions (all approved)

| Concern | Choice | Rejected alternative & why |
|---|---|---|
| Theming | Own inline `<head>` script + `ThemeToggle` (no dependency) | `next-themes`: new dependency, last release 0.4.6 (Mar 2025), logs a script-tag error on Next 16.2+ ([#385](https://github.com/pacocoursey/next-themes/issues/385), [#387](https://github.com/pacocoursey/next-themes/issues/387)) |
| Mobile flavor picker | Existing shadcn `Sheet` (Radix Dialog), `side="bottom"` | New `/flavor` overview route: changes structure |
| Rules search | Plain normalized substring filter (no dependency) | Fuse.js: dependency for ~20 articles, fuzzy results feel arbitrary in disputes |
| Rules page architecture | Server-rendered articles + small client islands that toggle DOM attributes | Client `RulesBrowser` owning all rendering |
| Search highlighting | CSS Custom Highlight API (Baseline 2025) as progressive enhancement, no DOM mutation | Wrapping matches in `<mark>` (would mutate server HTML) |
| Animation | Tailwind transitions + `tw-animate-css` (already installed) + a few `@keyframes` | Motion: new dependency, would mix animation libraries |
| Team/Einzel switch | shadcn **Tabs** (`@radix-ui/react-tabs@^1.2.1`, new dependency, same Radix family) | Hand-rolled segmented buttons (missing tab keyboard semantics) |
| Old sidebar | Delete `sidebar.tsx`, `tooltip.tsx`, `use-mobile.ts`, sidebar composites; remove `@radix-ui/react-tooltip` | Keeping dead code |
| Icons | `lucide-react` (unchanged) | — |
| Tables | `@tanstack/react-table` v9 (unchanged) | — |

No other libraries are added. Any further library question is raised with the maintainer first.

---

## 2. Breakpoints & layout grid

Tailwind v4 default breakpoints, mobile-first.

| Range | Name | Navigation | Rules page | Results page | Generator |
|---|---|---|---|---|---|
| `< 768px` | mobile | compact header + floating **BottomTabBar** | sticky toolbar (search + section chips) above content | single column | single column |
| `≥ md` 768px | tablet | sticky **SiteHeader** with pill nav, no bottom bar | same as mobile, wider cards | single column | single column |
| `≥ lg` 1024px | desktop | SiteHeader | 2 columns: sticky sidebar (search + TOC) `280px` + content `max-w-[820px]` | 2 columns: main + aside `320px` | 2 columns: sticky settings `380px` + suggestions |

- Page container: `mx-auto w-full max-w-(--container-page) px-4 md:px-8` with
  `--container-page: 77.5rem` (1240 px).
- Vertical rhythm: page top padding `pt-6 md:pt-10`, page bottom padding `pb-10 md:pb-20`.
- On mobile `<main>` gets extra bottom padding for the tab bar:
  `pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+1.5rem)] md:pb-0`.
- Safe areas: `viewport.viewportFit = "cover"`; tab bar and bottom sheet respect
  `env(safe-area-inset-bottom)`.

CSS layout variables (defined in `:root`, § 3.5): `--header-height` (`4rem` mobile,
`4.75rem` ≥ md), `--tabbar-height: 4.5rem`.

---

## 3. Design tokens (`src/app/globals.css`)

### 3.1 Approach

- Keep the **shadcn semantic variable names** (`--background`, `--primary`, …) so every
  `components/ui` primitive inherits the new look without per-component overrides.
- Add a few **brand tokens** (`--coral*`, `--sand`, `--brand-teal*`) exposed through
  `@theme inline` as Tailwind colors (`bg-coral`, `text-coral-ink`, …).
- Values are written as **hex** (directly traceable to the logo); the current oklch slate values
  are replaced completely.
- Remove unused variables: `--chart-*` and all `--sidebar-*`.
- Dark mode variant: `@custom-variant dark (&:where(.dark, .dark *));`
  (current Tailwind v4 syntax; replaces `(&:is(.dark *))`).

### 3.2 Color tokens

| Token | Light | Dark | Use |
|---|---|---|---|
| `--background` | `#fbf8f3` | `#0b1d1c` | page ground (cream / deep teal) |
| `--foreground` | `#0d2b29` | `#f4efe7` | body text |
| `--card` / `--popover` | `#ffffff` | `#12302d` | cards, sheets, dropdowns |
| `--card-foreground` / `--popover-foreground` | `#0d2b29` | `#f4efe7` | |
| `--primary` | `#016f62` | `#3fd0c5` | links, active states, rank 1 |
| `--primary-foreground` | `#ffffff` | `#062b29` | text on primary |
| `--secondary` | `#efeae0` | `#2a3f3c` | sand surfaces, rank 3, segmented track |
| `--secondary-foreground` | `#0d2b29` | `#f4efe7` | |
| `--muted` | `#f3efe8` | `#163633` | subtle fills |
| `--muted-foreground` | `#4f6664` | `#a9bdb9` | meta text, labels |
| `--accent` | `#d9f2ef` | `#17423e` | teal-soft: active nav, badges, hovers |
| `--accent-foreground` | `#016f62` | `#3fd0c5` | |
| `--destructive` | `#a8423e` | `#ff9d94` | errors, "exceeds" states |
| `--border` / `--input` | `#e7e1d7` | `#21433f` | hairlines |
| `--ring` | `#016f62` | `#3fd0c5` | focus ring (used at `/50`) |
| `--coral` | `#ff786e` | `#ff8a80` | decorative fills: dots, rank 2 block |
| `--coral-foreground` | `#2b0f0d` | `#2b0f0d` | text on coral |
| `--coral-soft` | `#ffe3e0` | `#4a2a28` | rank 2 tile |
| `--coral-ink` | `#a8423e` | `#ff9d94` | coral-toned **text** |
| `--sand` | `#efeae0` | `#2a3f3c` | alias of secondary for rank 3 / tracks |
| `--brand-teal` | `#00b3aa` | `#00b3aa` | logo teal, decorative only (never text) |
| `--brand-teal-dark` | `#018273` | `#018273` | logo dark teal, decorative only |

`@theme inline` additions: `--color-coral`, `--color-coral-foreground`, `--color-coral-soft`,
`--color-coral-ink`, `--color-sand`, `--color-brand-teal`, `--color-brand-teal-dark`.

### 3.3 Verified contrast (WCAG 2.x)

| Pair | Light | Dark |
|---|---|---|
| foreground / background | 14.21 | 15.20 |
| foreground / card | 15.06 | 12.34 |
| muted-foreground / background | 5.80 | 8.84 |
| muted-foreground / card | 6.15 | 7.18 |
| muted-foreground / secondary | 5.13 | 5.69 |
| primary / card | 6.08 | 7.43 |
| accent-foreground / accent | 5.19 | 5.86 |
| primary-foreground / primary | 6.08 | 7.97 |
| coral-ink / card | 5.98 | 7.07 |
| coral-ink / coral-soft | 4.93 | 6.35 |
| coral-foreground / coral | 6.94 | 7.82 |
| background / primary (rank-1 block) | 5.74 | 9.15 |

Rule: `--coral`, `--brand-teal`, `--brand-teal-dark` are **never** used for text.

### 3.4 Radius, shadow, easing

| Token | Value | Tailwind usage |
|---|---|---|
| `--radius` | `1rem` | base for shadcn (`rounded-lg` = 16px, `rounded-md` = 14px, `rounded-sm` = 12px, `rounded-xl` = 20px) |
| cards (mobile) | 20 px | `rounded-xl` |
| cards (≥ lg) | 24 px | `lg:rounded-3xl` |
| pills, chips, badges, buttons | full | `rounded-full` |
| `--shadow-float` | light `0 8px 24px rgb(13 43 41 / 0.08)` · dark `0 8px 24px rgb(0 0 0 / 0.35)` | `shadow-float` (tab bar, dropdown, sheet) |
| `--ease-out-soft` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | `ease-out-soft` |

### 3.5 Base layer additions

```css
:root { --header-height: 4rem; --tabbar-height: 4.5rem; color-scheme: light; }
@media (width >= 48rem) { :root { --header-height: 4.75rem; } }
.dark { color-scheme: dark; }
@media (width >= 48rem) { :root { scroll-padding-top: calc(var(--header-height) + 1.5rem); } } /* sticky header only ≥ md */
@media (prefers-reduced-motion: no-preference) { html { scroll-behavior: smooth; } }
body { font-feature-settings: "tnum" 0; } /* opt-in via tabular-nums only */
::selection { background: var(--accent); color: var(--accent-foreground); }
.theme-switching * { transition: none !important; } /* set briefly during theme toggle */
```

Global reduced-motion guard (in `@layer base`):

```css
@media (prefers-reduced-motion: reduce) {
    *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## 4. Typography

Font: `Bricolage_Grotesque` from `next/font/google` (`weight: "variable"`, `axes: ["opsz"]`,
`subsets: ["latin", "latin-ext"]`, `variable: "--font-bricolage"`, `display: "swap"`).
`--font-sans: var(--font-bricolage), ui-sans-serif, system-ui, sans-serif`.
`--font-mono` is removed (no monospace needed; numbers use `tabular-nums` — verified the font ships
`tnum`).

| Role | Mobile | ≥ lg | Weight | Tracking | Tailwind |
|---|---|---|---|---|---|
| Hero title | 46/46 | 64/64 | 800 | -0.03em | `text-[2.875rem] lg:text-[4rem] leading-none font-extrabold tracking-[-0.03em]` |
| Page title (h1) | 32/35 | 56/56 | 800 | -0.03em | `text-[2rem] lg:text-[3.5rem] leading-[1.1] lg:leading-none` |
| Page lead | 15/22 | 18/28 | 400 | — | `text-[0.9375rem] lg:text-lg text-muted-foreground` |
| Section label (h2) | 13 | 14 | 700 | 0.08em, uppercase | `text-[0.8125rem] lg:text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground` |
| Card title (h3) | 19/23 | 24/29 | 700 | -0.01em | `text-[1.1875rem] lg:text-2xl font-bold` |
| Body / rule text | 15.5/24 | 17/27 | 400 | — | `text-[0.96875rem] leading-[1.55] lg:text-[1.0625rem] lg:leading-[1.6]`, `max-w-[68ch]` |
| Meta / small | 13/18 | 13/18 | 500–600 | — | `text-[0.8125rem]` |
| Tab bar label | 12 | — | 600 (700 active) | — | `text-xs` |
| Numbers (badges, tables, podium) | — | — | 700–800 | — | always `tabular-nums` |

To avoid scattering arbitrary values, define these once in `@theme` as text tokens:
`--text-hero`, `--text-title`, `--text-lead`, `--text-label`, `--text-card-title`, `--text-rule`
(each with `--line-height` / `--letter-spacing` companions) so components use `text-title`,
`text-label`, … plus `lg:` overrides where the scale changes.

---

## 5. Motion inventory

All animations use `motion-safe:` (or the global guard in § 3.5). Durations: **fast 150 ms**,
**base 200 ms**, **slow 300–500 ms**.

| Where | What | Spec |
|---|---|---|
| All interactive elements | color/background/border | `transition-colors duration-150` |
| Buttons, chips, tabs, tab-bar items | press feedback | `active:scale-[0.97] transition-transform duration-150 ease-out-soft` |
| Bottom tab bar active item | indicator background | `transition-colors duration-200` |
| Flavor bottom sheet | slide/fade | `tw-animate-css` `slide-in-from-bottom` open **300 ms**, close **200 ms**, overlay `fade-in-0/fade-out-0` |
| Desktop Flavors dropdown | zoom/fade | existing `NavigationMenuViewport` animation, unchanged |
| Home hero | enter | logo, title, tagline: `motion-safe:animate-in fade-in slide-in-from-bottom-2 duration-500`, staggered `delay-0/75/150` |
| Article jumped to via `#id` (`:target`) | flash | keyframe `rule-flash` 1.2 s: `background-color: var(--accent)` → `var(--card)`, plus `ring-2 ring-primary/40` that persists while targeted |
| TOC / chips active item | scroll-spy change | `transition-colors duration-150`; active chip scrolled into view with `scrollIntoView({ inline: "nearest", block: "nearest" })` (instant under reduced motion) |
| Podium | blocks rise | keyframe `podium-rise` 500 ms `ease-out-soft`, `transform-origin: bottom`, `scaleY(0.2)→1` + fade; stagger 0 / 80 / 160 ms via `[animation-delay:…]`; replays when the tab switches (keyed by tab value) |
| Tabs | content swap | `data-[state=active]:animate-in fade-in-0 duration-200` |
| Theme toggle | icon swap | sun/moon cross-fade `transition-[opacity,transform] duration-200` with `rotate-90 scale-0` ↔ `rotate-0 scale-100`; page transitions disabled during the switch (`.theme-switching`) |
| Search filtering | — | **no animation** (hiding is instant to avoid layout jank); results count announced via `aria-live` |

---

## 6. File & component map

Legend: 🆕 new · ✏️ changed · 🗑️ deleted. Server components unless marked **(client)**.

### 6.1 `src/lib`

| File | Status | Content |
|---|---|---|
| `navigation.ts` | ✏️ | `NavItem` gains `shortTitle` (tab-bar label) and `match: (pathname) => boolean`. Items: Regelwerk (`BookOpen`, short "Regeln", matches `/flavor/regelwerk`), Flavors (`Flame`, matches other `/flavor/*`), Ergebnisse (`Trophy`, was `BarChart`, short "Ergebnisse"), Turniermodus Generator (`SlidersHorizontal`, was `Cog`, short "Generator"). Export `flavorItems` separately for the sheet/dropdown. |
| `ruleset-view.ts` | 🆕 | Pure helpers extracted from `flavor/[slug]/page.tsx`: `createReferenceMap(ruleset)`, `numberParagraphs(ruleset)`, `buildToc(ruleset): TocSection[]` (top-level sections with `{ id, number, title }` articles, empty sections skipped), `getArticleSearchText(article, refMap)` (strip HTML tags, resolve `[[ref:id]]` → `Art. N`, then `normalizeSearchText`). |
| `search.ts` | 🆕 | `normalizeSearchText(text)`: lower-case → `ä→ae, ö→oe, ü→ue, ß→ss` → NFD + strip combining marks → collapse whitespace. Used on server (`data-search`) and client (query). |
| `theme.ts` | 🆕 | `THEME_STORAGE_KEY = "theme"`, `type ThemePreference = "light" \| "dark"`, `themeInitScript` (string, § 7.1), `applyTheme(preference)` (client helper used by the toggle). |
| `tournament-utils.ts` | ✏️ | Add `getQualifiedStandings(standings)` (re-use `QUALIFIED_MIN_PARTICIPATIONS`), `getRecentTournaments(count)`, `formatDateParts(date) → { day, month }` (German short month via `Intl.DateTimeFormat("de-DE", { month: "short" })`, trailing dot removed). |
| `utils.ts` | — | unchanged |

### 6.2 `src/components/ui` (shadcn primitives — token-driven, minimal edits)

| File | Status | Changes |
|---|---|---|
| `button.tsx` | ✏️ | Base `rounded-full font-semibold active:scale-[0.97] transition-[color,background-color,box-shadow,transform]`. Sizes: `default h-11 px-5`, `sm h-9 px-4`, `lg h-12 px-6 text-base`, `icon size-11`. Variants unchanged. |
| `input.tsx` | ✏️ | `h-12 rounded-lg bg-card px-4 text-base` (16 px prevents iOS zoom), keeps focus ring. |
| `table.tsx` | ✏️ | Head: `h-11 px-3 text-xs font-bold uppercase tracking-[0.06em]`; cell `px-3 py-3.5 tabular-nums`; row hover `hover:bg-background`. |
| `sheet.tsx` | ✏️ | Durations open 300 / close 200 ms, close button `size-11 rounded-full` with German `sr-only` "Schließen", bottom side gets `rounded-t-3xl` and `pb-[env(safe-area-inset-bottom)]`. |
| `navigation-menu.tsx` | ✏️ | `navigationMenuTriggerStyle`: `h-11 rounded-full px-4 text-[0.9375rem] font-semibold`, active `data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-bold`; viewport `rounded-xl shadow-float border`. |
| `tabs.tsx` | 🆕 | Generated via `pnpm dlx shadcn@latest add tabs` (Radix variant; verify the CLI emits `@radix-ui/react-tabs`, otherwise write the Radix version by hand). Styled as segmented control: list `grid grid-cols-2 rounded-lg bg-secondary p-1`, trigger `h-11 rounded-md font-bold data-[state=active]:bg-card data-[state=active]:shadow-sm`. |
| `collapsible.tsx`, `separator.tsx`, `skeleton.tsx` | — | unchanged |
| `sidebar.tsx`, `tooltip.tsx` | 🗑️ | removed with the old mobile navigation |

### 6.3 `src/components/composites`

| File | Status | Responsibility |
|---|---|---|
| `site-header.tsx` | 🆕 | Global header. `< md`: `h-(--header-height)` row with `SiteLogo` (40 px + wordmark 18 px) and `ThemeToggle`; not sticky. `≥ md`: `sticky top-0 z-40 border-b bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70`, row = `SiteLogo` (44 px + wordmark 21 px) · centered `AppNavigationMenu` · `ThemeToggle`. |
| `site-logo.tsx` | 🆕 (replaces `navbar-logo.tsx` 🗑️) | `Link` to `/`, `next/image` `/logo.svg` (`priority`), wordmark "Bierpongregeln" `font-extrabold tracking-[-0.02em]`; `size: "sm" \| "md"`. |
| `app-navigation-menu.tsx` | ✏️ **(client)** | Uses `usePathname` + `item.match` to set `active` on `NavigationMenuLink`; Flavors dropdown content `grid w-[26rem] grid-cols-2 gap-1 p-3`, each item `rounded-lg px-3 py-3 font-semibold` with 8 px coral dot; removes the duplicated title/description `ListItem` and `React.forwardRef` (React 19 ref-as-prop). |
| `bottom-tab-bar.tsx` | 🆕 **(client)** | `md:hidden fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40`, `rounded-3xl border bg-card p-2 shadow-float grid grid-cols-4 gap-1`. Items: `min-h-14 rounded-lg flex flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground`, icon 22 px; active `bg-accent text-accent-foreground font-bold` + `aria-current="page"`. The Flavors item is a `SheetTrigger` (`aria-haspopup="dialog"`) opening `FlavorSheet`. `<nav aria-label="Hauptnavigation">`. |
| `flavor-sheet.tsx` | 🆕 **(client)** | `SheetContent side="bottom"`, `max-h-[80dvh] overflow-y-auto px-4 pt-3`, grab handle `mx-auto h-1.5 w-10 rounded-full bg-border`, `SheetTitle` "Flavors", `SheetDescription` (sr-only) "Flavor auswählen". List of flavor links wrapped in `SheetClose asChild`: rows `min-h-14 rounded-lg px-4 flex items-center gap-3 font-semibold hover:bg-accent`, coral dot, `ChevronRight` muted at the end; current flavor `bg-accent text-accent-foreground`. |
| `theme-toggle.tsx` | 🆕 **(client)** | `Button variant="outline" size="icon"` with `aria-label="Farbschema wechseln"`. Renders **both** `Sun` and `Moon`; visibility purely via `dark:` classes → no hydration mismatch, no mounted-state hack. On click: read `document.documentElement.classList.contains("dark")`, call `applyTheme(next)`. |
| `hero-splash.tsx` | 🆕 (replaces `hero-logo.tsx` 🗑️) | Props `title`, `description?`, `children?` (actions). Logo 250 px inside a 260 px `bg-accent rounded-full` disc, title `text-hero`, description `text-lead`, 4-dot motif (3 coral + 1 teal, 10 px, gap 6 px, `aria-hidden`). Vertically centred in `min-h-[calc(100dvh-var(--header-height)-var(--tabbar-height)-3rem)] md:min-h-[calc(100dvh-var(--header-height)-6rem)]`. Used by home, 404, coming-soon, error. |
| `page-header.tsx` | 🆕 | `title`, `description?`, `actions?` slot. h1 `text-title`, lead below; `flex flex-wrap items-end justify-between gap-5`. Used by rules, results, generator. |
| `section-label.tsx` | 🆕 | Uppercase label with 8 px coral dot; props `as` (`h2`/`h3`), `dot?: boolean`. Single place for the "label" look. |
| `search-field.tsx` | 🆕 | Presentational: `Input type="search"` with leading `Search` icon (`absolute left-4`, input `pl-11`), visually hidden `<label>`, optional trailing `<kbd>/</kbd>` (≥ lg), clear button slot. No state. |
| `sidebar-collapsible-menu-item.tsx`, `sidebar-simple-menu-item.tsx`, `app-sidebar.tsx` | 🗑️ | old mobile nav |

#### Rules (`src/components/composites/rules/`)

| File | Status | Responsibility |
|---|---|---|
| `rule-article.tsx` | 🆕 | Moved/restyled `ArticleComponent`: `<article id data-rule-article data-search>` `scroll-mt-36 lg:scroll-mt-0 rounded-xl border bg-card px-[1.125rem] py-4 lg:rounded-3xl lg:px-7 lg:py-6 target:ring-2 target:ring-primary/40 motion-safe:target:animate-[rule-flash_1.2s_var(--ease-out-soft)]`. Header: badge `Art. N` (`rounded-full bg-accent px-2.5 py-1 text-[0.8125rem] font-bold text-accent-foreground tabular-nums`) + title (`h3`/`h4` by depth). Paragraph `<ol>`: `grid grid-cols-[1.75rem_1fr] lg:grid-cols-[2.25rem_1fr]`, number `(n)` muted tabular. |
| `rule-paragraph.tsx` | 🆕 | Moved `ParagraphRenderer`. Refs are plain `<a href="#id">` (not `next/link`, whose `pushState` does not update `:target`). Ref link: `font-bold text-primary underline decoration-2 underline-offset-[3px] hover:decoration-coral`. Invalid ref: `text-destructive`. |
| `rule-section.tsx` | 🆕 | Moved `SectionComponent` (recursive). Depth 0: `<section id data-rule-section class="scroll-mt-36 lg:scroll-mt-0">` + `SectionLabel as="h2"` + `flex flex-col gap-2.5 lg:gap-3.5`; depth ≥ 1: `SectionLabel as="h3" dot={false}`. Section spacing `mt-8 lg:mt-10`. |
| `rules-toolbar.tsx` | 🆕 | Layout wrapper of the aside. `< lg`: `sticky top-0 z-30 -mx-4 px-4 py-3 bg-background/90 backdrop-blur-md border-b` containing `RulesSearch` and the section chip row; `≥ lg`: `sticky top-[calc(var(--header-height)+1.5rem)] max-h-[calc(100dvh-var(--header-height)-3rem)] overflow-y-auto` containing `RulesSearch` and the TOC. |
| `rules-toc.tsx` | 🆕 | `hidden lg:block`. `<nav aria-label="Artikel">`, groups per `TocSection` (`SectionLabel`), links `href="#id" data-toc-target="id"` `grid grid-cols-[2rem_1fr] min-h-9 items-center rounded-[0.625rem] px-2.5 text-[0.9375rem] font-medium hover:bg-accent data-[active=true]:bg-accent data-[active=true]:font-bold data-[active=true]:text-accent-foreground`. |
| `rules-section-chips.tsx` | 🆕 | `lg:hidden`, `flex gap-2 overflow-x-auto snap-x scrollbar-none -mx-4 px-4`. Chips are anchors `href="#section-id" data-chip-target` `min-h-9 shrink-0 snap-start rounded-full border bg-card px-3.5 text-sm font-semibold data-[active=true]:border-foreground data-[active=true]:bg-foreground data-[active=true]:text-background`. |
| `rules-search.tsx` | 🆕 **(client)** | Island, § 7.2. |
| `rules-scroll-spy.tsx` | 🆕 **(client)** | Island, § 7.3. Renders `null`. |

#### Results (`src/components/composites/tournament-results/`)

| File | Status | Responsibility |
|---|---|---|
| `rating-card.tsx` | ✏️ | Drop `emoji` prop; tone from `place` (1 `bg-accent text-accent-foreground`, 2 `bg-coral-soft text-coral-ink`, 3 `bg-secondary text-secondary-foreground`). `rounded-lg p-3 lg:p-3.5`, number `text-2xl lg:text-[1.75rem] font-extrabold tabular-nums`, label `{place}. Platz` + sr-only "{points} Punkte für Platz {place}". |
| `podium.tsx` | 🆕 | Props `standings: PlayerStanding[]` (already qualified + sorted). Displays `[2, 1, 3]` order (fewer than 3 → only existing). Column: initials avatar (`size-13 lg:size-16 rounded-full`, tone by place), name `font-bold`, meta `Quote 33 % · 60 Pkt.`, block heights `h-[4.5rem]/[5.75rem]/[7.5rem]` (lg `h-[5.25rem]/[7rem]/[9.375rem]`), `rounded-t-xl`, rank numeral `text-[1.75rem] lg:text-[2.5rem] font-extrabold`. Block tones: 1 `bg-primary text-primary-foreground`, 2 `bg-coral text-coral-foreground`, 3 `bg-secondary text-secondary-foreground`. Wrapper card `rounded-xl lg:rounded-3xl border bg-card px-4 pt-5 lg:px-7 lg:pt-7`. Uses an `<ol>` with `aria-label="Podest"` (ranks read in correct order via `value` attributes). |
| `standings-table.tsx` | ✏️ **(client)** | Logic unchanged. Card `rounded-xl lg:rounded-3xl border bg-card overflow-hidden`; rank + player columns `sticky left-0` / `left-10` with `bg-card` for horizontal scroll on mobile; points column `font-extrabold`; `SortButton` uses `Button size="sm" variant="ghost"`; "nicht gewertet" collapsible restyled with tokens. |
| `standings-tabs.tsx` | 🆕 | Server component composing `Tabs` (client primitive) with two panels "Team" / "Einzel"; each panel = `Podium` + `StandingsTable`. `TabsList` placed in `PageHeader` actions on ≥ lg, under the header on mobile. |
| `recent-tournaments.tsx` | 🆕 | Latest 3 tournaments: row `flex items-center gap-3 rounded-lg border bg-card px-4 py-3`, date block (`day` 20/22 px extrabold, `month` 12 px muted), winners `firstPlace.join(" & ")`, meta "Team · 28 Teilnehmer", flavor badge `rounded-full bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1`. Footer link "Alle Turniere anzeigen" → `#alle-turniere`. |
| `tournaments-table.tsx` | ✏️ | Card wrapper like standings; place colors: 1 `text-primary`, 2 `text-coral-ink`, 3 `text-foreground` (replaces yellow/slate/amber). |

#### Generator (`src/components/composites/tournament-generator/`)

| File | Status | Responsibility |
|---|---|---|
| `generator-slider.tsx` | 🆕 **(client)** | Extracted `GeneratorInput` from the page; native `<input type="range">` with class `range-input` and inline `--range-progress: <percent>%`. Value display `tabular-nums font-bold text-primary`. |
| `tournament-mode-card.tsx` | ✏️ | `rounded-xl lg:rounded-3xl border bg-card p-5`; best fit `border-primary ring-1 ring-primary/30` + badge "Empfehlung" (accent pill); duration pill `rounded-full bg-secondary px-3 py-1 font-bold tabular-nums`; exceeds `border-destructive/40 bg-destructive/5`, texts `text-destructive`; uneven-team hint `text-coral-ink` (replaces amber); stats as `<dl>` `grid grid-cols-2 gap-x-6 gap-y-1 sm:flex sm:flex-wrap`. |

Range input styling lives in `globals.css` `@layer components` (`.range-input`: `appearance-none h-11 bg-transparent`; track `h-2 rounded-full` with
`linear-gradient(var(--primary) 0 var(--range-progress), var(--secondary) 0)`; thumb `24px rounded-full bg-primary border-4 border-card shadow-float`, focus-visible ring) for both `::-webkit-slider-*` and `::-moz-range-*`.

### 6.4 `src/app`

| File | Status | Changes |
|---|---|---|
| `layout.tsx` | ✏️ | Bricolage font; `<head>` with theme init script; `viewport` export (`themeColor` light `#fbf8f3` / dark `#0b1d1c` via media, `viewportFit: "cover"`); body = skip link "Zum Inhalt springen" → `SiteHeader` → `<main id="main" class="…">` → `BottomTabBar`. Removes `SidebarProvider`, `AppSidebar`, `SidebarTrigger`, the commented breakpoint debug block. |
| `globals.css` | ✏️ | Tokens, base layer, keyframes (`rule-flash`, `podium-rise`), `.range-input`, `.scrollbar-none`, custom highlight `::highlight(rules-search)` (`background: var(--coral-soft); color: var(--foreground)`). |
| `page.tsx` | ✏️ | `HeroSplash` with title "Bierpongregeln", description "Die beste Bierpongregelsammlung!". |
| `flavor/[slug]/page.tsx` | ✏️ | Composes `PageHeader` (title = ruleset name, lead `Basisregeln · N Artikel` for `regelwerk`, `Flavor · N Artikel` otherwise), `lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:gap-12` with `RulesToolbar` (aside) and `<div id="rules-content">` of `RuleSection`s, empty state `<p data-rules-empty hidden>Keine Regel gefunden.</p>`, islands `RulesSearch`, `RulesScrollSpy`. Helpers move to `lib/ruleset-view.ts`. |
| `tournament-results/page.tsx` | ✏️ | `PageHeader` + `StandingsTabs`; `lg:grid lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8`; aside: "Punktevergabe" (`RatingCard` ×3) + "Letzte Turniere" (`RecentTournaments`); full-width `section#alle-turniere` with `TournamentsTable`. |
| `tournament-generator/page.tsx` | ✏️ **(client)** | `PageHeader`; `lg:grid lg:grid-cols-[23.75rem_minmax(0,1fr)] lg:gap-8`; settings card `lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]`; mode toggles = `Button size="sm"` (`default`/`outline`) with `aria-pressed`; suggestions list + "überschreiten" collapsible restyled. |
| `not-found.tsx`, `coming-soon/page.tsx`, `error.tsx` | ✏️ | `HeroSplash` (+ `Button asChild` link "Zurück zur Startseite" / "Erneut versuchen"). |
| `opengraph-image.tsx`, `twitter-image.tsx`, `icon.svg`, `robots.ts`, `sitemap.ts` | — | unchanged |

### 6.5 Other

| File | Status | Changes |
|---|---|---|
| `src/hooks/use-mobile.ts` | 🗑️ | only used by the sidebar |
| `src/components/types/logo.types.ts` | 🗑️ | replaced by props of `SiteLogo` / `HeroSplash` |
| `package.json` | ✏️ | `+ @radix-ui/react-tabs`, `− @radix-ui/react-tooltip` |
| `AGENTS.md`, `README.md` | ✏️ | structure, theming and new composites documented |

---

## 7. Behaviour specifications

### 7.1 Theme

`themeInitScript` (inlined via `<script dangerouslySetInnerHTML>` as the first child of `<head>` in
the root layout — a server component):

```js
(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = () => { try { return localStorage.getItem("theme"); } catch { return null; } };
    const apply = () => {
        const pref = stored();
        root.classList.toggle("dark", pref ? pref === "dark" : media.matches);
    };
    apply();
    media.addEventListener("change", apply);
})();
```

- `<html>` keeps `suppressHydrationWarning`.
- `applyTheme(next)`: add `.theme-switching` to `<html>`, toggle `.dark`, write `localStorage`
  (try/catch), remove `.theme-switching` on the next animation frame ×2.
- Two-state toggle: without a stored preference the system setting is followed (live); the first
  click stores an explicit choice.
- Known limitation: the `theme-color` meta follows the system, not a manual override.
- Implemented following Next's bundled guide
  `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`:
  - the script is rendered through `components/composites/inline-script.tsx` (`type` is
    `text/javascript` on the server and `text/plain` on the client), which avoids React's
    development warning about script tags;
  - `ThemeToggle` calls `syncTheme()` in `useLayoutEffect`, because the Strict Mode remount in
    development resets the attributes of `<html>` (no-op in production).
- Verified in Chromium (dev server): system light/dark detected, toggle persists across reload, no
  console warnings.

### 7.2 Rules search (`RulesSearch`, client island)

- Markup contract (server): `#rules-content` contains `[data-rule-section]` and
  `[data-rule-article][data-search="<normalized text>"]`; TOC links `[data-toc-target]`; chips
  `[data-chip-target]`; empty state `[data-rules-empty]`; live region `[data-rules-count]` in the
  `PageHeader` lead.
- State: `query` (string). On change:
  1. `q = normalizeSearchText(query)`; empty → show everything.
  2. Each article: `hidden = !data-search.includes(q)`.
  3. Each section: `hidden` if it has no visible article descendant (nested sections included).
  4. TOC links / chips: `hidden` mirrors their target.
  5. Count text: `"N Treffer"` / default lead restored when empty; empty state toggled.
  6. Highlights: if `"highlights" in CSS`, walk text nodes of visible articles with a
     `TreeWalker`, build `Range`s for each match (match against a normalized copy of the text
     node with an index map so `ß`/umlaut expansions map back to source offsets), set
     `CSS.highlights.set("rules-search", new Highlight(...ranges))`; clear on empty query and on
     unmount.
- Keyboard: `/` focuses the field (ignored while typing in an input/textarea/contenteditable);
  `Escape` clears and keeps focus. Clear button (`X`, `size-11`) visible when non-empty.
- No URL syncing (anchors `#id` already provide shareable links).
- Known build warning: Turbopack's CSS parser does not recognise `::highlight()` and logs
  "Parsing CSS source code failed"; the rule is still emitted unchanged (verified in the built CSS).

### 7.3 Scroll spy (`RulesScrollSpy`, client island)

- `IntersectionObserver` on `[data-rule-article]` with
  `rootMargin: "-30% 0px -60% 0px"`; the last intersecting article becomes active.
- Sets `data-active="true"` on the matching `[data-toc-target]` and on the chip of its top-level
  section; removes it elsewhere.
- On mobile, scrolls the active chip into view (`inline: "nearest"`, `behavior` `"smooth"` unless
  reduced motion).
- Ignores hidden (filtered) articles.

### 7.4 Navigation active state

| Pathname | Active item |
|---|---|
| `/` | none |
| `/flavor/regelwerk` | Regelwerk |
| `/flavor/<other>` | Flavors (+ current flavor highlighted in sheet/dropdown) |
| `/tournament-results` | Ergebnisse |
| `/tournament-generator` | Generator |

### 7.5 Results data

- Podium = first three of `getQualifiedStandings(...)` in the existing default order (Siegquote →
  P/TN → Punkte → Siege → Podest → TN), so it always matches table ranks 1–3.
- Meta line: `Quote {winRate·100, 0 decimals} % · {totalScore} Pkt.` (German number format via
  `Intl.NumberFormat("de-DE")`).

---

## 8. Accessibility checklist

- Skip link (`sr-only focus:not-sr-only`, first focusable element).
- One `<h1>` per page; heading levels follow section depth.
- `aria-current="page"` on active nav items (header and tab bar).
- Icon-only buttons have German `aria-label`s.
- Touch targets ≥ 44 × 44 px (tab items 56 px high, chips 36 px high but ≥ 44 px wide tap area via
  `py` padding inside the 52 px toolbar row — verify).
- Focus ring `focus-visible:ring-[3px] ring-ring/50` on every interactive element (inherited from
  primitives, added to custom links).
- Search result count announced via `aria-live="polite"`.
- Tabs keyboard support via Radix.
- Colors never carry meaning alone (podium also shows rank numerals; best-fit card has a text badge).
- Reduced motion fully respected.

---

## 9. Responsive QA matrix

Check every page at **360, 390, 768, 1024, 1280, 1440 px**, light + dark:

- No horizontal page scroll (tables scroll inside their card).
- Bottom tab bar never covers content (last article/table row fully visible).
- Sticky rules toolbar / sidebar do not overlap the header.
- Anchor jumps (`Art. N` links, TOC, chips) land below sticky elements.
- Flavor sheet scrolls when taller than 80 dvh; closes on navigation.
- iOS: no zoom on input focus (16 px), safe-area insets respected.

---

## 10. Out of scope

Flavor diff badges, combinations panel, URL-synced search, new data or routes, social image
redesign, i18n, analytics.

---

## 11. Definition of done (per commit)

1. `pnpm exec biome ci --error-on-warnings` passes.
2. `pnpm run typecheck` passes.
3. `pnpm build` passes.
4. `pnpm run data-consistency-check` passes.
5. The site is usable after the commit (no half-broken navigation between commits).
6. Conventional commit message, one logical change per commit.

---

## 12. Commit plan

| # | Commit | Scope |
|---|---|---|
| 0 | `docs: add redesign plan` | this document |
| 1 | `refactor(rules): extract ruleset view helpers` | `lib/ruleset-view.ts`, page uses it; no visual change |
| 2 | `feat(ui): add design tokens and Bricolage Grotesque font` | `globals.css` tokens/base/variant, `layout.tsx` font, remove Geist |
| 3 | `feat(ui): add theme init script and theme toggle` | `lib/theme.ts`, `theme-toggle.tsx`, layout `<head>`, `viewport` export |
| 4 | `refactor(ui): restyle shadcn primitives for the new design` | `button`, `input`, `table`, `sheet`, `navigation-menu` |
| 5 | `feat(nav): add site header with active desktop navigation` | `site-logo.tsx`, `site-header.tsx`, `app-navigation-menu.tsx`, `navigation.ts` (`shortTitle`, `match`, icons); temporary: mobile still uses the old sidebar trigger |
| 6 | `feat(nav): replace mobile sidebar with bottom tab bar and flavor sheet` | `bottom-tab-bar.tsx`, `flavor-sheet.tsx`, layout, skip link, `main` padding |
| 7 | `chore: remove unused sidebar, tooltip and mobile hook` | delete files, `− @radix-ui/react-tooltip` |
| 8 | `feat(ui): add hero splash, page header and section label composites` | `hero-splash.tsx`, `page-header.tsx`, `section-label.tsx`; home, 404, coming-soon, error; delete `hero-logo.tsx`, `navbar-logo.tsx`, `logo.types.ts` |
| 9 | `feat(rules): redesign rule articles and sections` | `rules/rule-article.tsx`, `rule-paragraph.tsx`, `rule-section.tsx`, page header, `rule-flash` |
| 10 | `feat(rules): add table of contents, section chips and scroll spy` | `rules-toolbar.tsx`, `rules-toc.tsx`, `rules-section-chips.tsx`, `rules-scroll-spy.tsx`, `buildToc` |
| 11 | `feat(rules): add client-side rules search` | `lib/search.ts`, `search-field.tsx`, `rules-search.tsx`, `data-search`, highlight CSS |
| 12 | `refactor(results): restyle rating cards and tables` | `rating-card.tsx`, `standings-table.tsx`, `tournaments-table.tsx` |
| 13 | `feat(ui): add tabs primitive` | `pnpm dlx shadcn@latest add tabs` + restyle, `+ @radix-ui/react-tabs` |
| 14 | `feat(results): add podium, recent tournaments and team/single tabs` | `podium.tsx`, `recent-tournaments.tsx`, `standings-tabs.tsx`, `tournament-utils.ts` helpers, page layout, `podium-rise` |
| 15 | `feat(generator): redesign tournament generator` | `generator-slider.tsx`, `.range-input`, `tournament-mode-card.tsx`, page layout |
| 16 | `docs: document redesigned structure` | `AGENTS.md`, `README.md`, tick off this plan |

Dependency changes (#7, #13) were approved in the planning session.
