import {
    type Article,
    isSection,
    type Paragraph,
    type Ruleset,
    type Section,
} from "@/components/types/ruleset.types";
import { normalizeSearchText } from "@/lib/search";

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

/**
 * Plain, normalized text of an article (title and paragraphs) used by the client-side search.
 * HTML tags are stripped and references are resolved to their visible "Art. N" label.
 */
export function getArticleSearchText(article: Article, refMap: ReferenceMap): string {
    const paragraphs = article.paragraphs.map((p) =>
        p.content
            .replace(/\[\[ref:(.*?)\]\]/g, (_, id: string) => {
                const ref = refMap.get(id);
                return ref ? `Art. ${ref.number}` : "";
            })
            .replace(/<[^>]*>/g, ""),
    );
    return normalizeSearchText([article.title, ...paragraphs].join(" "));
}

export type TocArticle = { id: string; number: number; title: string };
export type TocSection = { id: string; title: string; articles: TocArticle[] };

function collectArticles(items: (Section | Article)[], refMap: ReferenceMap): TocArticle[] {
    return items.flatMap((item) =>
        isSection(item)
            ? collectArticles(item.content, refMap)
            : [{ id: item.id, number: refMap.get(item.id)?.number ?? 0, title: item.title }],
    );
}

/**
 * Builds the table of contents: top-level sections with all (nested) articles they contain.
 * Sections without articles are skipped.
 */
export function buildToc(ruleset: Ruleset, refMap: ReferenceMap): TocSection[] {
    return ruleset.sections
        .map((section) => ({
            id: section.id,
            title: section.title,
            articles: collectArticles(section.content, refMap),
        }))
        .filter((section) => section.articles.length > 0);
}
