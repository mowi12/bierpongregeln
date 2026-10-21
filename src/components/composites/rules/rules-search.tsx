"use client";

import { useEffect, useRef, useState } from "react";
import { SearchField } from "@/components/composites/search-field";
import { normalizeSearchText, normalizeWithSourceIndex } from "@/lib/search";

const HIGHLIGHT_NAME = "rules-search";

function supportsHighlights() {
    return typeof CSS !== "undefined" && "highlights" in CSS;
}

/**
 * Collects ranges of all matches of the normalized query inside the text nodes of an element.
 */
function findMatchRanges(root: HTMLElement, query: string): Range[] {
    const ranges: Range[] = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const source = node.textContent ?? "";
        const { text, sourceIndex } = normalizeWithSourceIndex(source);

        for (let at = text.indexOf(query); at !== -1; at = text.indexOf(query, at + query.length)) {
            const range = new Range();
            range.setStart(node, sourceIndex[at]);
            range.setEnd(node, sourceIndex[at + query.length - 1] + 1);
            ranges.push(range);
        }
    }

    return ranges;
}

/**
 * Filters the server-rendered rule articles by toggling `hidden` on articles, sections, TOC entries
 * and chips, announces the number of matches and highlights them via the CSS Custom Highlight API.
 */
export function RulesSearch() {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const defaultCountText = useRef<string | null>(null);

    // Focus the search with "/" unless the user is typing somewhere else
    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
            const target = event.target as HTMLElement;
            if (target.closest("input, textarea, select, [contenteditable='true']")) return;
            event.preventDefault();
            inputRef.current?.focus();
        }

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        const content = document.getElementById("rules-content");
        if (!content) return;

        const normalizedQuery = normalizeSearchText(query);
        const articles = Array.from(content.querySelectorAll<HTMLElement>("[data-rule-article]"));
        const sections = Array.from(content.querySelectorAll<HTMLElement>("[data-rule-section]"));
        const countElement = document.querySelector<HTMLElement>("[data-rules-count]");
        const emptyElement = document.querySelector<HTMLElement>("[data-rules-empty]");

        let matches = 0;
        for (const article of articles) {
            const isMatch = (article.dataset.search ?? "").includes(normalizedQuery);
            article.hidden = !isMatch;
            if (isMatch) matches++;
        }

        for (const section of sections) {
            section.hidden = !section.querySelector("[data-rule-article]:not([hidden])");
        }

        for (const link of document.querySelectorAll<HTMLElement>("[data-toc-target]")) {
            const target = document.getElementById(link.dataset.tocTarget ?? "");
            if (link.parentElement) link.parentElement.hidden = target?.hidden ?? false;
        }
        for (const group of document.querySelectorAll<HTMLElement>("[data-toc-section]")) {
            const target = document.getElementById(group.dataset.tocSection ?? "");
            group.hidden = target?.hidden ?? false;
        }
        for (const chip of document.querySelectorAll<HTMLElement>("[data-chip-target]")) {
            const target = document.getElementById(chip.dataset.chipTarget ?? "");
            if (chip.parentElement) chip.parentElement.hidden = target?.hidden ?? false;
        }

        if (countElement) {
            defaultCountText.current ??= countElement.textContent;
            countElement.textContent = normalizedQuery
                ? `${matches} Treffer`
                : defaultCountText.current;
        }
        if (emptyElement) emptyElement.hidden = matches > 0;

        // Keep the results in view when filtering from further down the page
        if (normalizedQuery && content.getBoundingClientRect().top < 0) {
            content.scrollIntoView({ block: "start" });
        }

        if (supportsHighlights()) {
            if (normalizedQuery) {
                const ranges = articles
                    .filter((article) => !article.hidden)
                    .flatMap((article) => findMatchRanges(article, normalizedQuery));
                CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
            } else {
                CSS.highlights.delete(HIGHLIGHT_NAME);
            }
        }
    }, [query]);

    // Clean up the highlight when leaving the page
    useEffect(
        () => () => {
            if (supportsHighlights()) CSS.highlights.delete(HIGHLIGHT_NAME);
        },
        [],
    );

    return (
        <SearchField
            id="rules-search"
            label="Regeln durchsuchen"
            placeholder="Regel suchen"
            shortcut="/"
            value={query}
            onValueChange={setQuery}
            inputRef={inputRef}
            onKeyDown={(event) => {
                if (event.key === "Escape") setQuery("");
            }}
        />
    );
}
