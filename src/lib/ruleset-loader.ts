import { klona } from "klona";
import {
    type Article,
    isSection,
    type Ruleset,
    type Section,
} from "@/components/types/ruleset.types";

const rulesetData = {
    // Base Ruleset
    regelwerk: () => import("@/data/rulesets/regelwerk").then((m) => m.regelwerk),

    // Flavors
    moritz: () => import("@/data/rulesets/moritz").then((m) => m.moritz),
    felix: () => import("@/data/rulesets/felix").then((m) => m.felix),
    marcel: () => import("@/data/rulesets/marcel").then((m) => m.marcel),
    "game-pigeon": () => import("@/data/rulesets/game-pigeon").then((m) => m.gamePigeon),
    "3d": () => import("@/data/rulesets/3d").then((m) => m.dreiD), // Note the variable is 'dreiD'
    "mehr-baelle": () => import("@/data/rulesets/mehr-baelle").then((m) => m.mehrBaelle),
    sniper: () => import("@/data/rulesets/sniper").then((m) => m.sniper),
    "double-table": () => import("@/data/rulesets/double-table").then((m) => m.doubleTable),
};

type RulesetSlug = keyof typeof rulesetData;

export async function getRulesetSlugs(): Promise<string[]> {
    return Object.keys(rulesetData);
}

function mergeRulesets(base: Ruleset, flavor: Ruleset): Ruleset {
    const merged = klona(base);

    merged.name = flavor.name;
    merged.slug = flavor.slug;
    merged.baseRulesetSlug = flavor.baseRulesetSlug;
    merged.sidebarPosition = flavor.sidebarPosition;
    merged.combinations = flavor.combinations;
    // Each ruleset has its own summary, so the base summary must not leak into flavors
    merged.summary = flavor.summary;

    const mergeContent = (
        baseContent: (Section | Article)[],
        flavorContent: (Section | Article)[],
    ) => {
        flavorContent.forEach((flavorItem) => {
            const baseIndex = baseContent.findIndex((baseItem) => baseItem.id === flavorItem.id);
            if (baseIndex !== -1) {
                // Item exists, merge or replace
                const baseItem = baseContent[baseIndex];
                if ("content" in baseItem && "content" in flavorItem) {
                    // It's a Section, recurse
                    mergeContent(baseItem.content, flavorItem.content);
                    // Also update title if changed
                    baseItem.title = flavorItem.title;
                } else {
                    // It's an Article, replace it
                    baseContent[baseIndex] = flavorItem;
                }
            } else {
                // Item is new, add it
                baseContent.push(flavorItem);
            }
        });
    };

    mergeContent(merged.sections, flavor.sections);
    return merged;
}

/**
 * Drops articles without paragraphs and sections left without content. Flavors remove a base
 * article by overriding it with no paragraphs, so it must not be rendered, numbered or listed.
 */
function removeEmptyItems(ruleset: Ruleset): Ruleset {
    const prune = <T extends Section | Article>(items: T[]): T[] =>
        items.flatMap((item) => {
            if (isSection(item)) {
                const content = prune(item.content);
                return content.length > 0 ? [{ ...item, content }] : [];
            }
            return item.paragraphs.length > 0 ? [item] : [];
        });

    return { ...ruleset, sections: prune(ruleset.sections) };
}

export async function getMergedRuleset(slug: string): Promise<Ruleset | null> {
    if (!(slug in rulesetData)) {
        return null;
    }

    const flavorData = await rulesetData[slug as RulesetSlug]();

    if (!flavorData.baseRulesetSlug) {
        // This is the base ruleset itself
        return removeEmptyItems(flavorData);
    }

    const baseData = await rulesetData[flavorData.baseRulesetSlug as RulesetSlug]();
    if (!baseData) {
        throw new Error(
            `Base ruleset "${flavorData.baseRulesetSlug}" not found for flavor "${slug}".`,
        );
    }

    return removeEmptyItems(mergeRulesets(baseData, flavorData));
}
