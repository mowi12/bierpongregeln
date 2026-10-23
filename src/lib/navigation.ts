import { BookOpen, Flame, type LucideIcon, SlidersHorizontal, Trophy } from "lucide-react";
import type { Ruleset } from "@/components/types/ruleset.types";
import { dreiD } from "@/data/rulesets/3d";
import { doubleTable } from "@/data/rulesets/double-table";
import { felix } from "@/data/rulesets/felix";
import { gamePigeon } from "@/data/rulesets/game-pigeon";
import { marcel } from "@/data/rulesets/marcel";
import { mehrBaelle } from "@/data/rulesets/mehr-baelle";
import { moritz } from "@/data/rulesets/moritz";
import { regelwerk } from "@/data/rulesets/regelwerk";
import { sniper } from "@/data/rulesets/sniper";

export interface NavSubItem {
    title: string;
    url: string;
}

export interface NavItem {
    title: string;
    // Compact label for the mobile tab bar
    shortTitle: string;
    url: string;
    icon: LucideIcon;
    // Whether the item is the active one for the given pathname
    match: (pathname: string) => boolean;
    subItems?: NavSubItem[];
}

const allRulesets: Ruleset[] = [
    regelwerk,
    moritz,
    felix,
    marcel,
    gamePigeon,
    dreiD,
    mehrBaelle,
    sniper,
    doubleTable,
];

const regelwerkUrl = `/flavor/${regelwerk.slug}`;

// Separate the flavors from the base ruleset and sort them
export const flavorItems: NavSubItem[] = allRulesets
    .filter((ruleset) => ruleset.slug !== regelwerk.slug) // Exclude the base ruleset
    .sort((a, b) => a.sidebarPosition - b.sidebarPosition) // Sort by sidebarPosition
    .map((flavor) => ({
        title: flavor.name,
        url: `/flavor/${flavor.slug}`,
    }));

export const navigationItems: NavItem[] = [
    {
        title: "Regelwerk",
        shortTitle: "Regeln",
        url: regelwerkUrl,
        icon: BookOpen,
        match: (pathname) => pathname === regelwerkUrl,
    },
    {
        title: "Flavors",
        shortTitle: "Flavors",
        url: flavorItems.length > 0 ? flavorItems[0].url : "#",
        icon: Flame,
        match: (pathname) => pathname.startsWith("/flavor/") && pathname !== regelwerkUrl,
        subItems: flavorItems,
    },
    {
        title: "Ergebnisse",
        shortTitle: "Ergebnisse",
        url: "/tournament-results",
        icon: Trophy,
        match: (pathname) => pathname.startsWith("/tournament-results"),
    },
    {
        title: "Turniermodus Generator",
        shortTitle: "Generator",
        url: "/tournament-generator",
        icon: SlidersHorizontal,
        match: (pathname) => pathname === "/tournament-generator",
    },
];
