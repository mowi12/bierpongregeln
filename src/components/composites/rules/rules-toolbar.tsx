import type React from "react";

/**
 * Sticky rules navigation: a toolbar above the content on small screens and a sidebar next to it
 * on large screens. On large screens only the table of contents scrolls, so the search stays in
 * view and its focus ring is not clipped by a scroll container.
 */
export function RulesToolbar({ children }: { children: React.ReactNode }) {
    return (
        <aside
            aria-label="Regelnavigation"
            className="bg-background/90 supports-[backdrop-filter]:bg-background/75 sticky top-0 z-30 -mx-4 flex flex-col gap-3 border-b px-4 py-3 backdrop-blur-md md:-mx-8 md:px-8 lg:top-[calc(var(--header-height)+1.5rem)] lg:mx-0 lg:max-h-[calc(100dvh-var(--header-height)-3rem)] lg:gap-5 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none lg:supports-[backdrop-filter]:bg-transparent"
        >
            {children}
        </aside>
    );
}
