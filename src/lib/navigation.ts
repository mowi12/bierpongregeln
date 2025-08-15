import { BookOpen, Flame, BarChart, Trophy, Cog, type LucideIcon } from "lucide-react";

export interface NavItem {
    title: string;
    url: string;
    icon: LucideIcon;
    subItems?: {
        title: string;
        url: string;
    }[];
}

export const navigationItems: NavItem[] = [
    {
        title: "Regelwerk",
        url: "#",
        icon: BookOpen,
    },
    {
        title: "Flavors",
        url: "#",
        icon: Flame,
        subItems: [
            {
                title: "Flavor 1",
                url: "#",
            },
            {
                title: "Flavor 2",
                url: "#",
            },
        ],
    },
    {
        title: "Ergebnisse",
        url: "#",
        icon: BarChart,
    },
    {
        title: "Cups",
        url: "#",
        icon: Trophy,
        subItems: [
            {
                title: "Cup 1",
                url: "#",
            },
        ],
    },
    {
        title: "Turniermodus Generator",
        url: "#",
        icon: Cog,
    },
];
