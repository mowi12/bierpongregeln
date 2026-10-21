import { RuleArticle } from "@/components/composites/rules/rule-article";
import { SectionLabel } from "@/components/composites/section-label";
import { isSection, type Section } from "@/components/types/ruleset.types";
import type { ReferenceMap } from "@/lib/ruleset-view";
import { cn } from "@/lib/utils";

/**
 * Renders a Section, which can contain other Sections or Articles recursively.
 */
export function RuleSection({
    section,
    refMap,
    depth = 0,
}: {
    section: Section;
    refMap: ReferenceMap;
    depth?: number;
}) {
    if (section.content.length === 0) {
        return null;
    }

    const isTopLevel = depth === 0;

    return (
        <section
            id={section.id}
            data-rule-section
            className={cn("scroll-mt-40 lg:scroll-mt-28", isTopLevel ? "mt-8 lg:mt-10" : "mt-2")}
        >
            <SectionLabel
                as={isTopLevel ? "h2" : "h3"}
                dot={isTopLevel}
                className={cn("mb-2.5 lg:mb-3.5", isTopLevel ? "ml-1" : "ml-1 opacity-80")}
            >
                {section.title}
            </SectionLabel>
            <div className="flex flex-col gap-2.5 lg:gap-3.5">
                {section.content.map((item) =>
                    isSection(item) ? (
                        <RuleSection
                            key={item.id}
                            section={item}
                            refMap={refMap}
                            depth={depth + 1}
                        />
                    ) : (
                        <RuleArticle
                            key={item.id}
                            article={item}
                            refMap={refMap}
                            headingLevel={isTopLevel ? "h3" : "h4"}
                        />
                    ),
                )}
            </div>
        </section>
    );
}
