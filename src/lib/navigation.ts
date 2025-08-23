import { BookOpen, Flame, BarChart, Trophy, Cog, type LucideIcon } from "lucide-react";
import { regelwerk } from "@/data/rulesets/regelwerk";
import { moritz } from "@/data/rulesets/moritz";
import { felix } from "@/data/rulesets/felix";
import { marcel } from "@/data/rulesets/marcel";
import { gamePigeon } from "@/data/rulesets/game-pigeon";
import { dreiD } from "@/data/rulesets/3d";
import { mehrBaelle } from "@/data/rulesets/mehr-baelle";
import { sniper } from "@/data/rulesets/sniper";
import { doubleTable } from "@/data/rulesets/double-table";
import { Ruleset } from "@/components/types/ruleset.types";

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
    .filter(ruleset => ruleset.slug !== 'regelwerk') // Exclude the base ruleset
    .sort((a, b) => a.sidebarPosition - b.sidebarPosition); // Sort by sidebarPosition

// Map the sorted flavors to the sub-item structure
const flavorSubItems = flavors.map(flavor => ({
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
        url: flavorSubItems.length > 0 ? flavorSubItems[0].url : '#',
        icon: Flame,
        subItems: flavorSubItems,
    },
    {
        title: "Ergebnisse",
        url: "/coming-soon",
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
        url: "/coming-soon",
        icon: Cog,
    },
];