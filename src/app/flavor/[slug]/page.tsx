import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/composites/page-header";
import { RuleSection } from "@/components/composites/rules/rule-section";
import { getMergedRuleset, getRulesetSlugs } from "@/lib/ruleset-loader";
import { createReferenceMap, numberParagraphs } from "@/lib/ruleset-view";

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

    const kind = ruleset.baseRulesetSlug === null ? "Basisregeln" : "Flavor";

    return (
        <>
            <PageHeader title={ruleset.name} description={`${kind} · ${refMap.size} Artikel`} />
            <div className="max-w-[51.25rem]">
                {ruleset.sections.map((section) => (
                    <RuleSection key={section.id} section={section} refMap={refMap} />
                ))}
            </div>
        </>
    );
}
