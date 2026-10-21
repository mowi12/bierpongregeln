import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Page title with an optional lead text and an actions slot (aligned right on large screens).
 */
export function PageHeader({
    title,
    description,
    actions,
    className,
}: {
    title: string;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={cn("flex flex-wrap items-end justify-between gap-5", className)}>
            <div className="min-w-0">
                <h1 className="text-title lg:text-title-lg">{title}</h1>
                {description && (
                    <p className="text-lead lg:text-lead-lg text-muted-foreground mt-2 lg:mt-3">
                        {description}
                    </p>
                )}
            </div>
            {actions}
        </div>
    );
}
