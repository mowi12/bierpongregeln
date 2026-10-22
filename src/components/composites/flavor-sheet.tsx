"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { flavorItems } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/**
 * Bottom sheet listing all flavors. The passed child becomes the trigger.
 */
export function FlavorSheet({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <Sheet>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent side="bottom" className="max-h-[80dvh] gap-2 overflow-y-auto px-4 pt-3">
                <div aria-hidden="true" className="bg-border mx-auto h-1.5 w-10 rounded-full" />
                <SheetHeader className="px-1 pt-2 pb-1">
                    <SheetTitle className="text-card-title">Flavors</SheetTitle>
                    <SheetDescription className="sr-only">Flavor auswählen</SheetDescription>
                </SheetHeader>
                <ul className="flex flex-col gap-1 pb-4">
                    {flavorItems.map((flavor) => {
                        const isCurrent = pathname === flavor.url;

                        return (
                            <li key={flavor.url}>
                                <SheetClose asChild>
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
                                </SheetClose>
                            </li>
                        );
                    })}
                </ul>
            </SheetContent>
        </Sheet>
    );
}
