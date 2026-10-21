import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react";
import { BottomTabBar } from "@/components/composites/bottom-tab-bar";
import { InlineScript } from "@/components/composites/inline-script";
import { SiteHeader } from "@/components/composites/site-header";
import { baseUrl } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

const bricolage = Bricolage_Grotesque({
    variable: "--font-bricolage",
    subsets: ["latin", "latin-ext"],
    axes: ["opsz"],
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL(baseUrl),
    title: "Bierpongregeln",
    description: "Die beste Bierpongregelsammlung!",
    openGraph: {
        title: "Bierpongregeln",
        description: "Die beste Bierpongregelsammlung!",
        locale: "de_DE",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export const viewport: Viewport = {
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#fbf8f3" },
        { media: "(prefers-color-scheme: dark)", color: "#0b1d1c" },
    ],
    viewportFit: "cover",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="de" data-scroll-behavior="smooth" suppressHydrationWarning>
            <head>
                <InlineScript html={themeInitScript} />
            </head>
            <body className={`${bricolage.variable} font-sans antialiased`}>
                <a
                    href="#main"
                    className="bg-card focus-visible:ring-ring/50 sr-only z-50 rounded-full px-5 py-3 font-semibold focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus-visible:ring-[3px]"
                >
                    Zum Inhalt springen
                </a>
                <div className="flex min-h-dvh flex-col">
                    <SiteHeader />
                    <main
                        id="main"
                        className="mx-auto w-full max-w-(--container-page) flex-1 px-4 pt-6 pb-[calc(var(--tabbar-height)+env(safe-area-inset-bottom)+1.5rem)] md:px-8 md:pt-10 md:pb-20"
                    >
                        {children}
                    </main>
                </div>
                <BottomTabBar />
            </body>
        </html>
    );
}
