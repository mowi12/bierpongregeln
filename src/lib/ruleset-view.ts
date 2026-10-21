import {
    type Article,
    isSection,
    type Paragraph,
    type Ruleset,
    type Section,
} from "@/components/types/ruleset.types";

export type ReferenceMap = Map<string, { number: number; title: string }>;

/**
 * Creates a map of Article ID to its dynamically calculated number and title.
 * This is used for resolving [[ref:id]] links into human-readable text.
 */
export function createReferenceMap(ruleset: Ruleset): ReferenceMap {
    const refMap: ReferenceMap = new Map();
    let articleCounter = 1;

    const traverse = (items: (Section | Article)[]) => {
        for (const item of items) {
            if (isSection(item)) {
                traverse(item.content);
            } else {
                refMap.set(item.id, {
                    number: articleCounter,
                    title: item.title,
                });
                articleCounter++;
            }
        }
    };

    traverse(ruleset.sections);
    return refMap;
}

function getParagraphs(section: Section): Paragraph[] {
    const paragraphs: Paragraph[] = [];
    for (const item of section.content) {
        if (isSection(item)) {
            paragraphs.push(...getParagraphs(item));
        } else {
            paragraphs.push(...item.paragraphs);
        }
    }
    return paragraphs;
}

/**
 * Assigns a unique, sequential ID to every paragraph of the ruleset for proper rendering.
 */
export function numberParagraphs(ruleset: Ruleset) {
    const allParagraphs = ruleset.sections.flatMap(getParagraphs);
    allParagraphs.forEach((p, i) => {
        p.id = `paragraph-${i + 1}`;
    });
}
