// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

const { version } = require('./package.json');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Bierpongregeln',
    tagline: 'Die beste Bierpongregelsammlung!',
    favicon: 'img/favicon.ico',

    // Set the production url of your site here
    url: 'https://mowi12.github.io',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/bierpongregeln/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'mowi12', // Usually your GitHub org/user name.
    projectName: 'bierpongregeln', // Usually your repo name.

    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internalization, you can use this field to set useful
    // metadata like html lang. For example, if your site is Chinese, you may want
    // to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'de',
        locales: ['de'],
    },

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                },
                blog: false,
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            colorMode: {
                defaultMode: 'dark',
                disableSwitch: false,
                respectPrefersColorScheme: true,
            },
            navbar: {
                title: 'Bierpongregeln',
                logo: {
                    alt: 'Bierpongregeln Logo',
                    src: 'img/navbar_logo.png',
                },
                hideOnScroll: true,
                items: [
                    { to: 'docs/regelwerk', label: 'Regelwerk', position: 'left' },
                    {
                        type: 'dropdown',
                        label: 'Flavors',
                        items: [
                            { to: 'docs/flavors/moritz', label: 'Moritz' },
                            { to: 'docs/flavors/felix', label: 'Felix' },
                            { to: 'docs/flavors/marcel', label: 'Marcel' },
                            { to: 'docs/flavors/game_pigeon', label: 'Game Pigeon' },
                            { to: 'docs/flavors/3d', label: '3D' },
                            { to: 'docs/flavors/mehr_baelle', label: 'Mehr Bälle' },
                            { to: 'docs/flavors/sniper', label: 'Sniper' },
                            { to: 'docs/flavors/double_table', label: 'Double Table' },
                        ],
                        position: 'left',
                    },
                    { to: 'docs/ergebnisse', label: 'Ergebnisse', position: 'left' },
                    {
                        href: 'https://github.com/mowi12/bierpongregeln',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                copyright: `Version <a href="https://github.com/mowi12/bierpongregeln/releases/tag/v${version}" target="_blank" rel="noreferrer">${version}</a><br>
                Copyright © ${new Date().getFullYear()} Felix Schlegel, Moritz Wieland. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
            tableOfContents: {
                minHeadingLevel: 2,
                maxHeadingLevel: 3,
            },
        }),

    plugins: [
        './src/plugins/leaderboard-plugin',
    ],
};

module.exports = config;
