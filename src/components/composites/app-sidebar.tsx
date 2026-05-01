"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
} from "@/components/ui/sidebar";
import { navigationItems } from "@/lib/navigation";
import { SidebarCollapsibleMenuItem } from "./sidebar-collapsible-menu-item";
import { SidebarSimpleMenuItem } from "./sidebar-simple-menu-item";

export function AppSidebar() {
    return (
        <Sidebar side={"right"} variant={"floating"}>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Bierpongregeln</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigationItems.map((item) =>
                                item.subItems && item.subItems.length > 0 ? (
                                    <SidebarCollapsibleMenuItem key={item.title} item={item} />
                                ) : (
                                    <SidebarSimpleMenuItem key={item.title} item={item} />
                                ),
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
