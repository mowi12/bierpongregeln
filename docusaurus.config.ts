import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import { execSync } from "child_process";
import { version } from "./package.json";

function getLastUpdate() {
    const date = execSync("git log -1 --pretty=%cd --date=format:%Y-%m-%d")
        .toString()
        .trim();
    return new Date(date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

const config: Config = {
    title: "Bierpongregeln",
    tagline: "Die beste Bierpongregelsammlung!",
    favicon: "img/favicon.ico",

    // Set the production url of your site here
    url: "https://mowi12.github.io",
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: "/bierpongregeln/",

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: "mowi12", // Usually your GitHub org/user name.
    projectName: "bierpongregeln", // Usually your repo name.

    onBrokenLinks: "throw",
    onBrokenMarkdownLinks: "warn",

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: "de",
        locales: ["de", "en"],
        localeConfigs: {
            de: {
                label: "Deutsch",
                direction: "ltr",
                htmlLang: "de",
            },
            en: {
                label: "English",
                direction: "ltr",
                htmlLang: "en",
            },
        },
    },

    presets: [
        [
            "classic",
            {
                docs: {
                    sidebarPath: "./sidebars.ts",
                },
                blog: false,
                theme: {
                    customCss: "./src/css/custom.css",
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        colorMode: {
            defaultMode: "dark",
            disableSwitch: false,
            respectPrefersColorScheme: true,
        },
        navbar: {
            title: "Bierpongregeln",
            logo: {
                alt: "Bierpongregeln Logo",
                src: "img/navbar_logo.png",
            },
            hideOnScroll: true,
            items: [
                { to: "docs/regelwerk", label: "Regelwerk", position: "left" },
                {
                    type: "dropdown",
                    label: "Flavors",
                    items: [
                        { to: "docs/flavors/moritz", label: "Moritz" },
                        { to: "docs/flavors/felix", label: "Felix" },
                        { to: "docs/flavors/marcel", label: "Marcel" },
                        {
                            to: "docs/flavors/game_pigeon",
                            label: "Game Pigeon",
                        },
                        { to: "docs/flavors/3d", label: "3D" },
                        { to: "docs/flavors/mehr_baelle", label: "Mehr Bälle" },
                        { to: "docs/flavors/sniper", label: "Sniper" },
                        {
                            to: "docs/flavors/double_table",
                            label: "Double Table",
                        },
                    ],
                    position: "left",
                },
                {
                    to: "docs/ergebnisse",
                    label: "Ergebnisse",
                    position: "left",
                },
                {
                    type: "dropdown",
                    label: "Cups",
                    items: [
                        {
                            to: "docs/cups/greiner-cup-3",
                            label: "3. Greiner Cup",
                        },
                    ],
                    position: "left",
                },
                {
                    to: "docs/tournament_mode_generator",
                    label: "Turniermodus-Generator",
                    position: "left",
                },
                {
                    type: "docsVersionDropdown",
                    position: "right",
                },
                {
                    type: "localeDropdown",
                    position: "right",
                },
                {
                    href: "https://github.com/mowi12/bierpongregeln",
                    label: "GitHub",
                    position: "right",
                },
            ],
        },
        footer: {
            style: "dark",
            copyright: `Version <a href="https://github.com/mowi12/bierpongregeln/releases/tag/v${version}"
                target="_blank" rel="noreferrer">${version}</a> (last update ${getLastUpdate()})  <br>
                Copyright © ${new Date().getFullYear()} Felix Schlegel, Moritz Wieland. Built with Docusaurus.`,
        },
        prism: {
            theme: prismThemes.github,
            darkTheme: prismThemes.dracula,
        },
        tableOfContents: {
            minHeadingLevel: 2,
            maxHeadingLevel: 3,
        },
    } satisfies Preset.ThemeConfig,
    plugins: ["./src/plugins/leaderboard-plugin/index.ts"],
};

export default config;
