"use client";

import { XIcon } from "lucide-react";
import type * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@/lib/utils";

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Root>) {
    return <DrawerPrimitive.Root data-slot="drawer" {...props} />;
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
    return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
    return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
    return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerOverlay({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
    return (
        <DrawerPrimitive.Overlay
            data-slot="drawer-overlay"
            className={cn("fixed inset-0 z-50 bg-black/50", className)}
            {...props}
        />
    );
}

/**
 * Bottom drawer that can be dragged down to close. Vaul animates the open, close and drag
 * transforms itself, so no Tailwind transitions are applied to the content.
 */
function DrawerContent({
    className,
    children,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
    return (
        <DrawerPortal>
            <DrawerOverlay />
            <DrawerPrimitive.Content
                data-slot="drawer-content"
                className={cn(
                    "bg-background shadow-float fixed inset-x-0 bottom-0 z-50 flex h-auto flex-col rounded-t-3xl border-t pb-[env(safe-area-inset-bottom)] outline-none",
                    className,
                )}
                {...props}
            >
                <div
                    aria-hidden="true"
                    className="bg-border mx-auto mt-3 h-1.5 w-10 shrink-0 rounded-full"
                />
                {children}
                <DrawerPrimitive.Close className="hover:bg-accent focus-visible:ring-ring/50 absolute top-3 right-3 flex size-11 items-center justify-center rounded-full opacity-70 transition-[opacity,background-color] hover:opacity-100 focus-visible:ring-[3px] focus-visible:outline-hidden disabled:pointer-events-none">
                    <XIcon className="size-5" />
                    <span className="sr-only">Schließen</span>
                </DrawerPrimitive.Close>
            </DrawerPrimitive.Content>
        </DrawerPortal>
    );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="drawer-header"
            className={cn("flex flex-col gap-1.5 p-4", className)}
            {...props}
        />
    );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
    return (
        <DrawerPrimitive.Title
            data-slot="drawer-title"
            className={cn("text-foreground font-semibold", className)}
            {...props}
        />
    );
}

function DrawerDescription({
    className,
    ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
    return (
        <DrawerPrimitive.Description
            data-slot="drawer-description"
            className={cn("text-muted-foreground text-sm", className)}
            {...props}
        />
    );
}

export {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
};
