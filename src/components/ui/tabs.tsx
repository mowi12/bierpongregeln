"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type * as React from "react";

import { cn } from "@/lib/utils";

function Tabs({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Root>) {
    return (
        <TabsPrimitive.Root
            data-slot="tabs"
            className={cn("flex flex-col gap-4", className)}
            {...props}
        />
    );
}

function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            data-slot="tabs-list"
            className={cn(
                "bg-secondary text-muted-foreground inline-grid auto-cols-fr grid-flow-col gap-1 rounded-lg p-1",
                className,
            )}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            data-slot="tabs-trigger"
            className={cn(
                "text-secondary-foreground/70 hover:text-secondary-foreground focus-visible:ring-ring/50 data-[state=active]:bg-card data-[state=active]:text-foreground inline-flex h-11 items-center justify-center gap-1.5 rounded-md px-4 text-[0.9375rem] font-bold whitespace-nowrap transition-[color,background-color,box-shadow,transform] duration-150 ease-out-soft outline-none focus-visible:ring-[3px] active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
    return (
        <TabsPrimitive.Content
            data-slot="tabs-content"
            className={cn(
                "outline-none motion-safe:data-[state=active]:animate-in motion-safe:data-[state=active]:fade-in-0 motion-safe:data-[state=active]:duration-200",
                className,
            )}
            {...props}
        />
    );
}

export { Tabs, TabsContent, TabsList, TabsTrigger };
