import { BarChart, BookOpen, Cog, Flame, type LucideIcon, Trophy } from "lucide-react";
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

export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    subItems?: {
        title: string;
        url: string;
    }[];
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

// Separate the flavors from the base ruleset and sort them
const flavors = allRulesets
    .filter((ruleset) => ruleset.slug !== "regelwerk") // Exclude the base ruleset
    .sort((a, b) => a.sidebarPosition - b.sidebarPosition); // Sort by sidebarPosition

// Map the sorted flavors to the sub-item structure
const flavorSubItems = flavors.map((flavor) => ({
    title: flavor.name,
    url: `/flavor/${flavor.slug}`,
}));

export const navigationItems: NavItem[] = [
    {
        title: "Regelwerk",
        url: `/flavor/${regelwerk.slug}`,
        icon: BookOpen,
    },
    {
        title: "Flavors",
        url: flavorSubItems.length > 0 ? flavorSubItems[0].url : "#",
        icon: Flame,
        subItems: flavorSubItems,
    },
    {
        title: "Ergebnisse",
        url: "/tournament-results",
        icon: BarChart,
    },
    {
        title: "Cups",
        url: "#",
        icon: Trophy,
        subItems: [
            {
                title: "2. Greiner Cup",
                url: "/coming-soon",
            },
        ],
    },
    {
        title: "Turniermodus Generator",
        url: "/tournament-generator",
        icon: Cog,
    },
];
