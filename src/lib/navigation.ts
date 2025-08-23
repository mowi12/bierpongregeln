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
        url: "/coming-soon",
        icon: BookOpen,
    },
    {
        title: "Flavors",
        url: "/coming-soon",
        icon: Flame,
        subItems: [
            {
                title: "Flavor 1",
                url: "/coming-soon",
            },
            {
                title: "Flavor 2",
                url: "/coming-soon",
            },
        ],
    },
    {
        title: "Ergebnisse",
        url: "/coming-soon",
        icon: BarChart,
    },
    {
        title: "Cups",
        url: "/coming-soon",
        icon: Trophy,
        subItems: [
            {
                title: "Cup 1",
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
