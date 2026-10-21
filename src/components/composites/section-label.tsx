import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Small uppercase heading with an optional coral dot, used for sections and groups.
 */
export function SectionLabel({
    as: Heading = "h2",
    dot = true,
    className,
    children,
}: {
    as?: "h2" | "h3" | "h4" | "div";
    dot?: boolean;
    className?: string;
    children: React.ReactNode;
}) {
    return (
        <Heading
            className={cn(
                "text-label lg:text-label-lg text-muted-foreground flex items-center gap-2 uppercase",
                className,
            )}
        >
            {dot && <span aria-hidden="true" className="bg-coral size-2 shrink-0 rounded-full" />}
            {children}
        </Heading>
    );
}
