"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { navigationItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function AppNavigationMenu() {
    const pathname = usePathname();

    return (
        <NavigationMenu aria-label="Hauptnavigation">
            <NavigationMenuList className="gap-1">
                {navigationItems.map((item) => {
                    const isActive = item.match(pathname);

                    return (
                        <NavigationMenuItem key={item.title}>
                            {item.subItems ? (
                                <>
                                    <NavigationMenuTrigger
                                        data-active={isActive || undefined}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {item.title}
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent>
                                        <ul className="grid w-[26rem] grid-cols-2 gap-1 p-3">
                                            {item.subItems.map((subItem) => {
                                                const isCurrent = pathname === subItem.url;

                                                return (
                                                    <li key={subItem.url}>
                                                        <NavigationMenuLink
                                                            asChild
                                                            active={isCurrent}
                                                            className={cn(
                                                                "flex-row items-center gap-3 rounded-lg px-3 py-3 text-[0.9375rem] font-semibold",
                                                                "data-active:bg-accent data-active:text-accent-foreground",
                                                            )}
                                                        >
                                                            <Link
                                                                href={subItem.url}
                                                                aria-current={
                                                                    isCurrent ? "page" : undefined
                                                                }
                                                            >
                                                                <span
                                                                    aria-hidden="true"
                                                                    className="bg-coral size-2 shrink-0 rounded-full"
                                                                />
                                                                {subItem.title}
                                                            </Link>
                                                        </NavigationMenuLink>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </NavigationMenuContent>
                                </>
                            ) : (
                                <NavigationMenuLink
                                    asChild
                                    active={isActive}
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link
                                        href={item.url}
                                        aria-current={isActive ? "page" : undefined}
                                    >
                                        {item.title}
                                    </Link>
                                </NavigationMenuLink>
                            )}
                        </NavigationMenuItem>
                    );
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}
