import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composites/app-sidebar";
import { AppNavigationMenu } from "@/components/composites/app-navigation-menu";
import { cn } from "@/lib/utils";
import { NavbarLogo } from "@/components/composites/navbar-logo";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Bierpongregeln",
    description: "Die beste Bierpongregelsammlung!",
};

export default function RootLayout({ children }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
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
                    </nav>

                    {/* --- Mobile Navigation --- */}
                    <div className="flex items-center justify-between p-4 md:hidden">
                        <NavbarLogo />
                        <SidebarTrigger />
                    </div>

                    <main className="flex-1">{children}</main>
                </div>
            </div>
        </SidebarProvider>
        <div
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
        </div>
        </body>
        </html>
    );
}