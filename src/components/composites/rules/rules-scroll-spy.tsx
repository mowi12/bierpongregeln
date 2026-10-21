"use client";

import { useEffect } from "react";

function scrollBehavior(): ScrollBehavior {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

/**
 * Keeps scroll positions of a scrollable container so the given element stays visible.
 */
function revealInContainer(element: HTMLElement, container: HTMLElement, axis: "x" | "y") {
    if (container.offsetParent === null) return; // container is hidden on this breakpoint

    const elementRect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    if (axis === "x") {
        const left = elementRect.left - containerRect.left + container.scrollLeft;
        const centered = left - (containerRect.width - elementRect.width) / 2;
        container.scrollTo({ left: centered, behavior: scrollBehavior() });
    } else if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
        const top = elementRect.top - containerRect.top + container.scrollTop;
        container.scrollTo({ top: top - containerRect.height / 3, behavior: scrollBehavior() });
    }
}

/**
 * Highlights the table-of-contents entry and section chip of the article currently in view.
 * Works on the server-rendered markup via data attributes and renders nothing itself.
 */
export function RulesScrollSpy() {
    useEffect(() => {
        const articles = Array.from(document.querySelectorAll<HTMLElement>("[data-rule-article]"));
        const tocLinks = Array.from(document.querySelectorAll<HTMLElement>("[data-toc-target]"));
        const chips = Array.from(document.querySelectorAll<HTMLElement>("[data-chip-target]"));
        const chipList = document.querySelector<HTMLElement>("[data-chip-list]");
        const tocContainer = tocLinks[0]?.closest("aside") ?? null;
        const intersecting = new Set<HTMLElement>();
        let activeId: string | null = null;

        function activate(article: HTMLElement) {
            if (article.id === activeId) return;
            activeId = article.id;

            for (const link of tocLinks) {
                const isActive = link.dataset.tocTarget === article.id;
                link.dataset.active = String(isActive);
                if (isActive && tocContainer) revealInContainer(link, tocContainer, "y");
            }

            for (const chip of chips) {
                const section = chip.dataset.chipTarget
                    ? document.getElementById(chip.dataset.chipTarget)
                    : null;
                const isActive = section?.contains(article) ?? false;
                const wasActive = chip.dataset.active === "true";
                chip.dataset.active = String(isActive);
                if (isActive && !wasActive && chipList) revealInContainer(chip, chipList, "x");
            }
        }

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    const target = entry.target as HTMLElement;
                    if (entry.isIntersecting) intersecting.add(target);
                    else intersecting.delete(target);
                }
                // The first visible article in document order wins
                const current = articles.find(
                    (article) => intersecting.has(article) && !article.hidden,
                );
                if (current) activate(current);
            },
            { rootMargin: "-30% 0px -60% 0px" },
        );

        for (const article of articles) observer.observe(article);
        return () => observer.disconnect();
    }, []);

    return null;
}
