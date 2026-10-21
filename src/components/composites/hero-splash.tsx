import Image from "next/image";
import type React from "react";
import { cn } from "@/lib/utils";

const logoSrc = "/logo.svg";

const enterClassName =
    "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:fill-mode-both motion-safe:duration-500";

/**
 * Centered logo splash used by the home page and the status pages (404, error, coming soon).
 */
export function HeroSplash({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children?: React.ReactNode;
}) {
    return (
        <div className="flex min-h-[calc(100dvh-var(--header-height)-var(--tabbar-height)-4rem)] flex-col items-center justify-center text-center md:min-h-[calc(100dvh-var(--header-height)-8rem)]">
            <div
                className={cn(
                    "relative flex size-65 items-center justify-center md:size-80",
                    enterClassName,
                )}
            >
                <div aria-hidden="true" className="bg-accent absolute inset-0 rounded-full" />
                <Image
                    priority
                    src={logoSrc}
                    alt="Bierpongregeln Logo"
                    width={320}
                    height={320}
                    className="relative size-[15.625rem] md:size-[19.5rem]"
                />
            </div>
            <h1 className={cn("text-hero md:text-hero-lg mt-7", enterClassName, "delay-75")}>
                {title}
            </h1>
            {description && (
                <p
                    className={cn(
                        "text-lead md:text-lead-lg text-muted-foreground mt-3",
                        enterClassName,
                        "delay-150",
                    )}
                >
                    {description}
                </p>
            )}
            <div aria-hidden="true" className="mt-7 flex gap-1.5">
                <span className="bg-coral size-2.5 rounded-full" />
                <span className="bg-coral size-2.5 rounded-full" />
                <span className="bg-coral size-2.5 rounded-full" />
                <span className="bg-primary size-2.5 rounded-full" />
            </div>
            {children && <div className="mt-8 flex flex-wrap justify-center gap-3">{children}</div>}
        </div>
    );
}
