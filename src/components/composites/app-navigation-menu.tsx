"use client";

import * as React from "react";
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
    return (
        <NavigationMenu>
            <NavigationMenuList className="h-full items-center">
                {navigationItems.map((item) => (
                    <NavigationMenuItem key={item.title}>
                        {item.subItems ? (
                            <>
                                <NavigationMenuTrigger
                                    className={cn(
                                        navigationMenuTriggerStyle(),
                                        "flex items-center justify-center",
                                    )}
                                >
                                    <span className="leading-none">{item.title}</span>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                                        {item.subItems.map((subItem) => (
                                            <ListItem
                                                key={subItem.title}
                                                href={subItem.url}
                                                title={subItem.title}
                                            >
                                                {subItem.title}
                                            </ListItem>
                                        ))}
                                    </ul>
                                </NavigationMenuContent>
                            </>
                        ) : (
                            <NavigationMenuLink
                                href={item.url}
                                className={cn(
                                    navigationMenuTriggerStyle(),
                                    "flex items-center justify-center",
                                )}
                            >
                                <span className="leading-none">{item.title}</span>
                            </NavigationMenuLink>
                        )}
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

const ListItem = React.forwardRef<React.ComponentRef<"a">, React.ComponentPropsWithoutRef<"a">>(
    ({ className, title, children, ...props }, ref) => {
        return (
            <li>
                <NavigationMenuLink asChild>
                    <a
                        ref={ref}
                        className={cn(
                            "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground block space-y-1 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none",
                            className,
                        )}
                        {...props}
                    >
                        <div className="text-sm leading-none font-medium">{title}</div>
                        <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                            {children}
                        </p>
                    </a>
                </NavigationMenuLink>
            </li>
        );
    },
);
ListItem.displayName = "ListItem";
