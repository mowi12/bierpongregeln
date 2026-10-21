"use client";

import { Moon, Sun } from "lucide-react";
import { useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { applyTheme, syncTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const iconClassName = "absolute size-5 transition-[opacity,transform] duration-200 ease-out-soft";

/**
 * Both icons are always rendered and swapped via the `dark` variant, so the server markup
 * never depends on the (unknown) client theme.
 */
export function ThemeToggle({ className }: { className?: string }) {
    useLayoutEffect(syncTheme, []);

    function toggleTheme() {
        const isDark = document.documentElement.classList.contains("dark");
        applyTheme(isDark ? "light" : "dark");
    }

    return (
        <Button
            variant="outline"
            size="icon"
            aria-label="Farbschema wechseln"
            onClick={toggleTheme}
            className={cn("relative rounded-full bg-card", className)}
        >
            <Moon
                className={cn(iconClassName, "scale-100 rotate-0 dark:scale-0 dark:-rotate-90")}
            />
            <Sun className={cn(iconClassName, "scale-0 rotate-90 dark:scale-100 dark:rotate-0")} />
        </Button>
    );
}
