import { RuleParagraph } from "@/components/composites/rules/rule-paragraph";
import type { Article } from "@/components/types/ruleset.types";
import type { ReferenceMap } from "@/lib/ruleset-view";
import { cn } from "@/lib/utils";

/**
 * Renders a single Article as a card. Highlights itself briefly when targeted via its anchor.
 */
export function RuleArticle({
    article,
    refMap,
    headingLevel,
}: {
    article: Article;
    refMap: ReferenceMap;
    headingLevel: "h3" | "h4";
}) {
    const Heading = headingLevel;
    const number = refMap.get(article.id)?.number;

    return (
        <article
            id={article.id}
            data-rule-article
            className={cn(
                "bg-card scroll-mt-40 rounded-xl border px-[1.125rem] py-4 lg:scroll-mt-28 lg:rounded-3xl lg:px-7 lg:py-6",
                "target:ring-primary/40 target:ring-2 motion-safe:target:animate-rule-flash",
            )}
        >
            <div className="mb-2.5 flex items-center gap-2.5 lg:mb-3.5 lg:gap-3">
                <span className="bg-accent text-accent-foreground shrink-0 rounded-full px-2.5 py-1 text-[0.8125rem] font-bold tabular-nums lg:px-3 lg:text-sm">
                    Art. {number}
                </span>
                <Heading className="text-card-title lg:text-card-title-lg">{article.title}</Heading>
            </div>
            <ol className="text-rule lg:text-rule-lg flex flex-col gap-2 lg:gap-2.5">
                {article.paragraphs.map((p, i) => (
                    <li
                        key={p.id}
                        className="grid max-w-[68ch] grid-cols-[1.75rem_minmax(0,1fr)] lg:grid-cols-[2.25rem_minmax(0,1fr)]"
                    >
                        <span aria-hidden="true" className="text-muted-foreground tabular-nums">
                            ({i + 1})
                        </span>
                        <p>
                            <RuleParagraph content={p.content} refMap={refMap} />
                        </p>
                    </li>
                ))}
            </ol>
        </article>
    );
}
