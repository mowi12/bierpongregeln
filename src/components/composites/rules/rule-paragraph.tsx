import Link from "next/link";
import type { ReferenceMap } from "@/lib/ruleset-view";

/**
 * Renders the content of a paragraph, parsing out any [[ref:id]] links
 * and converting them into clickable <Link> components.
 */
export function RuleParagraph({ content, refMap }: { content: string; refMap: ReferenceMap }) {
    const parts = content.split(/(\[\[ref:.*?\]\])/g);

    return parts.map((part, index) => {
        const match = part.match(/\[\[ref:(.*?)\]\]/);
        if (match) {
            const refId = match[1];
            const key = `ref-${refId}-${index}`;
            const refData = refMap.get(refId);
            if (refData) {
                return (
                    <Link
                        key={key}
                        href={`#${refId}`}
                        className="text-primary hover:decoration-coral font-bold underline decoration-2 underline-offset-[3px] transition-colors duration-150"
                    >
                        Art. {refData.number}
                    </Link>
                );
            }
            return (
                <span key={key} className="text-destructive">
                    [Invalid Ref: {refId}]
                </span>
            );
        }
        // biome-ignore lint: lint/security/noDangerouslySetInnerHtml
        return <span key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    });
}
