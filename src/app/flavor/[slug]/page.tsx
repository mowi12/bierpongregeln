import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/composites/page-header";
import { RuleSection } from "@/components/composites/rules/rule-section";
import { RulesScrollSpy } from "@/components/composites/rules/rules-scroll-spy";
import { RulesSectionChips } from "@/components/composites/rules/rules-section-chips";
import { RulesToc } from "@/components/composites/rules/rules-toc";
import { RulesToolbar } from "@/components/composites/rules/rules-toolbar";
import { getMergedRuleset, getRulesetSlugs } from "@/lib/ruleset-loader";
import { buildToc, createReferenceMap, numberParagraphs } from "@/lib/ruleset-view";

// --- The Page Component ---

type FlavorPageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ params }: FlavorPageProps): Promise<Metadata> {
    const { slug } = await params;
    const ruleset = await getMergedRuleset(slug);
    if (!ruleset) return {};
    return {
        title: `${ruleset.name} | Bierpongregeln`,
        description: `${ruleset.name} – Bierpongregelwerk`,
    };
}

export async function generateStaticParams() {
    const slugs = await getRulesetSlugs();
    return slugs.map((slug: string) => ({ slug }));
}

export default async function FlavorPage({ params }: FlavorPageProps) {
    const { slug } = await params;
    const ruleset = await getMergedRuleset(slug);

    if (!ruleset) {
        notFound();
    }

    const refMap = createReferenceMap(ruleset);
    numberParagraphs(ruleset);

    const toc = buildToc(ruleset, refMap);
    const kind = ruleset.baseRulesetSlug === null ? "Basisregeln" : "Flavor";

    return (
        <>
            <PageHeader title={ruleset.name} description={`${kind} · ${refMap.size} Artikel`} />
            <div className="mt-5 lg:mt-10 lg:grid lg:grid-cols-[17.5rem_minmax(0,1fr)] lg:items-start lg:gap-12">
                <RulesToolbar>
                    <RulesSectionChips toc={toc} />
                    <RulesToc toc={toc} />
                </RulesToolbar>
                <div id="rules-content" className="max-w-[51.25rem] min-w-0 lg:-mt-10">
                    {ruleset.sections.map((section) => (
                        <RuleSection key={section.id} section={section} refMap={refMap} />
                    ))}
                </div>
            </div>
            <RulesScrollSpy key={slug} />
        </>
    );
}
