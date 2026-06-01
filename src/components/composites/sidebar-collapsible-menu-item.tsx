"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function SidebarCollapsibleMenuItem({ item }: { item: NavItem }) {
    const [open, setOpen] = useState(false);

    return (
        <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title} onClick={() => setOpen((o) => !o)}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                <ChevronRight
                    className={cn("ml-auto transition-transform duration-200", open && "rotate-90")}
                />
            </SidebarMenuButton>
            <div
                className={cn(
                    "grid transition-all duration-200 ease-in-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
            >
                <div className="overflow-hidden">
                    <SidebarMenuSub>
                        {item.subItems?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton asChild>
                                    <a href={subItem.url}>
                                        <span>{subItem.title}</span>
                                    </a>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        ))}
                    </SidebarMenuSub>
                </div>
            </div>
        </SidebarMenuItem>
    );
}
