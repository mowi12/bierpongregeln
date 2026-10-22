"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FlavorSheet } from "@/components/composites/flavor-sheet";
import { type NavItem, navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const itemClassName =
    "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-xs font-semibold text-muted-foreground outline-none transition-[color,background-color,transform] duration-200 ease-out-soft active:scale-[0.97] focus-visible:ring-[3px] focus-visible:ring-ring/50";
const activeClassName = "bg-accent font-bold text-accent-foreground";

function TabContent({ item }: { item: NavItem }) {
    return (
        <>
            <item.icon aria-hidden="true" className="size-[1.375rem]" />
            {item.shortTitle}
        </>
    );
}

/**
 * Floating navigation for small screens. The Flavors tab opens the flavor sheet.
 */
export function BottomTabBar() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Hauptnavigation"
            className="bg-card shadow-float fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 rounded-3xl border p-2 md:hidden"
        >
            <ul className="grid grid-cols-4 gap-1">
                {navigationItems.map((item) => {
                    const isActive = item.match(pathname);
                    const className = cn(itemClassName, isActive && activeClassName);

                    return (
                        <li key={item.title}>
                            {item.subItems ? (
                                <FlavorSheet>
                                    <button
                                        type="button"
                                        aria-haspopup="dialog"
                                        className={cn(className, "w-full")}
                                    >
                                        <TabContent item={item} />
                                    </button>
                                </FlavorSheet>
                            ) : (
                                <Link
                                    href={item.url}
                                    aria-current={isActive ? "page" : undefined}
                                    className={className}
                                >
                                    <TabContent item={item} />
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
