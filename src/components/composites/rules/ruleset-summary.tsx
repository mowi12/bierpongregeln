import { ArrowRight } from "lucide-react";
import { RuleParagraph } from "@/components/composites/rules/rule-paragraph";
import type { ReferenceMap } from "@/lib/ruleset-view";

/**
 * Card with the most important rules of a ruleset, shown above the full rules. The tilted badge
 * breaks the top edge, so the card needs extra space above it.
 */
export function RulesetSummary({
    items,
    isBase,
    refMap,
}: {
    items: string[];
    isBase: boolean;
    refMap: ReferenceMap;
}) {
    return (
        <section
            aria-labelledby="ruleset-summary"
            className="bg-coral-soft relative mt-9 max-w-[51.25rem] rounded-3xl px-5 pt-7 pb-5 lg:mt-12 lg:px-8 lg:pt-9 lg:pb-7"
        >
            <h2
                id="ruleset-summary"
                className="bg-coral text-coral-foreground text-label shadow-float absolute -top-3.5 left-5 -rotate-3 rounded-full px-4 py-1.5 uppercase lg:left-8"
            >
                Kurz erklärt
            </h2>
            <p className="text-card-title lg:text-card-title-lg">
                {isBase ? "Die Grundregeln:" : "Wie Regelwerk, aber:"}
            </p>
            <ul className="text-rule lg:text-rule-lg mt-3 flex flex-col [&_strong]:text-coral-ink [&_strong]:font-bold">
                {items.map((item) => (
                    <li
                        key={item}
                        className="border-coral/30 flex gap-3 border-b border-dashed py-2.5 last:border-b-0"
                    >
                        <ArrowRight
                            aria-hidden="true"
                            className="text-coral-ink mt-[0.25em] size-5 shrink-0"
                        />
                        <span>
                            <RuleParagraph content={item} refMap={refMap} />
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
