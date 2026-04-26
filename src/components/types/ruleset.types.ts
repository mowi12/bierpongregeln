/**
 * Represents a single text block. The content can contain Markdown and special syntax
 * for references, e.g., "See [[ref:art-12-aufsetzer]] for more details."
 * It also supports strikethroughs and highlights directly in the string.
 */
export type Paragraph = {
    // We can use a single content string that contains simple HTML/Markdown for styling.
    // e.g., "<del>Old text.</del> <Highlight>New text.</Highlight>"
    // This is easier to author than complex object structures.
    content: string;
};

/**
 * An Article is a specific rule, like "Art. 11 - Balls Back".
 * The article number ("Art. 11") will be generated dynamically during render.
 */
export type Article = {
    // A unique, kebab-case identifier for this article. Crucial for merging and referencing.
    // e.g., "balls-back", "konter-nachspiel"
    id: string;
    title: string;
    paragraphs: Paragraph[];
};

/**
 * A Section is a container for Articles or other nested Sections.
 * e.g., "Allgemeine Regeln" or "Spielablauf"
 */
export type Section = {
    // A unique, kebab-case identifier for the section, used for anchor links.
    // e.g., "allgemeine-regeln"
    id: string;
    title: string;
    // A section can contain other sections or a list of articles.
    content: (Section | Article)[];
};

/**
 * Describes the compatibility of this ruleset with another.
 */
export type CombinationRule = {
    // The slug of the other flavor, e.g., "moritz"
    flavorSlug: string;
    // The name of the other flavor, e.g., "Moritz"
    flavorName: string;
    status: "compatible" | "incompatible" | "restricted";
    // Optional notes for restricted combinations.
    notes?: Paragraph[];
};

/**
 * The root type for a complete ruleset or a Flavor.
 */
export type Ruleset = {
    // The user-facing name, e.g., "Felix"
    name: string;
    // The URL-friendly slug, e.g., "felix"
    slug: string;
    // The slug of the ruleset this one extends. 'null' for the base ruleset.
    baseRulesetSlug: string | null;
    sidebarPosition: number;
    sections: Section[];
    combinations: CombinationRule[];
};
