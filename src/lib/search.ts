const replacements: Record<string, string> = { ä: "ae", ö: "oe", ü: "ue", ß: "ss" };

export type NormalizedText = {
    text: string;
    // Index into the source text for every character of `text`
    sourceIndex: number[];
};

/**
 * Normalizes text for matching: lower case, German umlauts and ß spelled out (so "umschmeissen"
 * finds "umschmeißen"), remaining accents removed and whitespace collapsed. Also returns where each
 * normalized character came from so matches can be mapped back to the source text.
 */
export function normalizeWithSourceIndex(source: string): NormalizedText {
    let text = "";
    const sourceIndex: number[] = [];

    for (let i = 0; i < source.length; i++) {
        const lower = source[i].toLowerCase();

        if (/\s/.test(lower)) {
            if (text.length > 0 && !text.endsWith(" ")) {
                text += " ";
                sourceIndex.push(i);
            }
            continue;
        }

        const normalized = (replacements[lower] ?? lower)
            .normalize("NFD")
            .replace(/\p{Mark}/gu, "");
        for (const char of normalized) {
            text += char;
            sourceIndex.push(i);
        }
    }

    return { text, sourceIndex };
}

export function normalizeSearchText(source: string): string {
    return normalizeWithSourceIndex(source).text.trim();
}
