"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { flavorItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet listing all flavors, closable by dragging it down. The passed child becomes the
 * trigger.
 */
export function FlavorSheet({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="max-h-[80dvh] gap-2 px-4">
                <DrawerHeader className="px-1 pt-2 pb-1">
                    <DrawerTitle className="text-card-title">Flavors</DrawerTitle>
                    <DrawerDescription className="sr-only">Flavor auswählen</DrawerDescription>
                </DrawerHeader>
                <ul className="flex flex-col gap-1 overflow-y-auto pb-4">
                    {flavorItems.map((flavor) => {
                        const isCurrent = pathname === flavor.url;

                        return (
                            <li key={flavor.url}>
                                <DrawerClose asChild>
                                    <Link
                                        href={flavor.url}
                                        aria-current={isCurrent ? "page" : undefined}
                                        className={cn(
                                            "hover:bg-accent focus-visible:ring-ring/50 flex min-h-14 items-center gap-3 rounded-lg px-4 font-semibold transition-colors duration-150 outline-none focus-visible:ring-[3px]",
                                            isCurrent && "bg-accent text-accent-foreground",
                                        )}
                                    >
                                        <span
                                            aria-hidden="true"
                                            className="bg-coral size-2 shrink-0 rounded-full"
                                        />
                                        <span className="flex-1">{flavor.title}</span>
                                        <ChevronRight
                                            aria-hidden="true"
                                            className="text-muted-foreground size-5"
                                        />
                                    </Link>
                                </DrawerClose>
                            </li>
                        );
                    })}
                </ul>
            </DrawerContent>
        </Drawer>
    );
}
