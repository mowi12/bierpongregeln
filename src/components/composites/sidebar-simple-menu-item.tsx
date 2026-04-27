import { SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import type { NavItem } from "@/lib/navigation";

export function SidebarSimpleMenuItem({ item }: { item: NavItem }) {
    return (
        <SidebarMenuItem>
            <SidebarMenuButton tooltip={item.title} asChild>
                <a href={item.url}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                </a>
            </SidebarMenuButton>
        </SidebarMenuItem>
    );
}
