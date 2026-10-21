/**
 * Renders a script that runs during HTML parsing on full page loads. On the client the type is
 * switched to `text/plain` so React neither executes it again nor warns about script tags.
 * See `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.
 */
export function InlineScript({ html }: { html: string }) {
    return (
        <script
            type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
            suppressHydrationWarning
            // biome-ignore lint/security/noDangerouslySetInnerHtml: static, trusted script content
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
