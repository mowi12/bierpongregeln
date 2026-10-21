import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import type React from "react";
import { AppNavigationMenu } from "@/components/composites/app-navigation-menu";
import { AppSidebar } from "@/components/composites/app-sidebar";
import { InlineScript } from "@/components/composites/inline-script";
import { NavbarLogo } from "@/components/composites/navbar-logo";
import { ThemeToggle } from "@/components/composites/theme-toggle";
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
                        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                            {/* --- Desktop Navigation --- */}
                            <nav className="relative hidden items-center justify-center py-4 md:flex">
                                <div className="absolute left-0">
                                    <NavbarLogo />
                                </div>
                                <AppNavigationMenu />
                                <div className="absolute right-0">
                                    <ThemeToggle />
                                </div>
                            </nav>

                            {/* --- Mobile Navigation --- */}
                            <div className="flex items-center justify-between p-4 md:hidden">
                                <NavbarLogo />
                                <div className="flex items-center gap-2">
                                    <ThemeToggle />
                                    <SidebarTrigger />
                                </div>
                            </div>

                            <main className="flex-1">{children}</main>
                        </div>
                    </div>
                </SidebarProvider>
                {/*<div
            className={cn(
                "absolute right-1 bottom-1 rounded-md px-1.5",
                "bg-red-300 sm:bg-green-300 md:bg-yellow-300 lg:bg-blue-300 xl:bg-purple-300 2xl:bg-pink-300",
            )}
        >
            <div className="max-sm:visible sm:hidden">--</div>
            <div className="max-sm:hidden sm:visible md:hidden">sm</div>
            <div className="max-md:hidden md:visible lg:hidden">md</div>
            <div className="max-lg:hidden lg:visible xl:hidden">lg</div>
            <div className="max-xl:hidden xl:visible 2xl:hidden">xl</div>
            <div className="max-2xl:hidden 2xl:visible">2xl</div>
        </div> */}
            </body>
        </html>
    );
}
