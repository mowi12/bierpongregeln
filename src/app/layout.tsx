import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/composites/app-sidebar";
import { AppNavigationMenu } from "@/components/composites/app-navigation-menu";

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

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <SidebarProvider defaultOpen={false}>
                    <AppSidebar />
                    <main className="flex min-h-screen w-full flex-col">
                        {/* Desktop Navigation - Hidden on mobile */}
                        <nav className="hidden items-center justify-center p-4 md:flex">
                            <AppNavigationMenu />
                        </nav>

                        {/* Mobile Sidebar Trigger - Right aligned, visible only on mobile */}
                        <div className="flex justify-end p-4 md:hidden">
                            <SidebarTrigger className="ml-auto" />
                        </div>

                        <div className="flex-1 p-4">{children}</div>
                    </main>
                </SidebarProvider>
            </body>
        </html>
    );
}
