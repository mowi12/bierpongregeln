import { SectionLabel } from "@/components/composites/section-label";
import type { TocSection } from "@/lib/ruleset-view";

/**
 * Article list for the sidebar on large screens. Active state is set by RulesScrollSpy.
 */
export function RulesToc({ toc }: { toc: TocSection[] }) {
    return (
        <nav aria-label="Artikel" className="hidden flex-col gap-5 lg:flex">
            {toc.map((section) => (
                <div key={section.id} data-toc-section={section.id}>
                    <SectionLabel as="div" className="mb-1.5 ml-2.5">
                        {section.title}
                    </SectionLabel>
                    <ul>
                        {section.articles.map((article) => (
                            <li key={article.id}>
                                <a
                                    href={`#${article.id}`}
                                    data-toc-target={article.id}
                                    className="hover:bg-accent focus-visible:ring-ring/50 data-[active=true]:bg-accent data-[active=true]:text-accent-foreground grid min-h-9 grid-cols-[2rem_minmax(0,1fr)] items-center rounded-[0.625rem] px-2.5 text-[0.9375rem] font-medium transition-colors duration-150 outline-none focus-visible:ring-[3px] data-[active=true]:font-bold"
                                >
                                    <span className="text-muted-foreground text-[0.8125rem] font-semibold tabular-nums">
                                        {article.number}
                                    </span>
                                    <span className="truncate">{article.title}</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </nav>
    );
}
