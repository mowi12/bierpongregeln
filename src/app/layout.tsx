import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react";
import { AppSidebar } from "@/components/composites/app-sidebar";
import { InlineScript } from "@/components/composites/inline-script";
import { SiteHeader } from "@/components/composites/site-header";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
        <html lang="de" suppressHydrationWarning>
            <head>
                <InlineScript html={themeInitScript} />
            </head>
            <body className={`${bricolage.variable} font-sans antialiased`}>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <div className="flex min-h-screen w-full flex-col">
                        <SiteHeader />
                        <main className="mx-auto w-full max-w-(--container-page) flex-1 px-4 md:px-8">
                            {children}
                        </main>
                        {/* Temporary mobile menu until the bottom tab bar replaces the sidebar */}
                        <div className="fixed right-4 bottom-4 z-40 md:hidden">
                            <SidebarTrigger />
                        </div>
                    </div>
                </SidebarProvider>
            </body>
        </html>
    );
}
