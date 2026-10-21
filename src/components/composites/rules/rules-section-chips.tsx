import type { TocSection } from "@/lib/ruleset-view";

/**
 * Horizontally scrolling section shortcuts for small screens. Active state is set by
 * RulesScrollSpy.
 */
export function RulesSectionChips({ toc }: { toc: TocSection[] }) {
    return (
        <nav aria-label="Abschnitte" className="lg:hidden">
            <ul
                data-chip-list
                className="scrollbar-none -mx-4 flex snap-x scroll-px-4 gap-2 overflow-x-auto px-4"
            >
                {toc.map((section) => (
                    <li key={section.id} className="shrink-0 snap-start">
                        <a
                            href={`#${section.id}`}
                            data-chip-target={section.id}
                            className="bg-card focus-visible:ring-ring/50 data-[active=true]:border-foreground data-[active=true]:bg-foreground data-[active=true]:text-background flex min-h-9 items-center rounded-full border px-3.5 text-sm font-semibold whitespace-nowrap transition-colors duration-150 outline-none focus-visible:ring-[3px]"
                        >
                            {section.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
