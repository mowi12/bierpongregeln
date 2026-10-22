import { AppNavigationMenu } from "@/components/composites/app-navigation-menu";
import { SiteLogo } from "@/components/composites/site-logo";
import { ThemeToggle } from "@/components/composites/theme-toggle";

export function SiteHeader() {
    return (
        <header className="md:bg-background/85 md:supports-[backdrop-filter]:bg-background/70 z-40 md:sticky md:top-0 md:border-b md:backdrop-blur-md">
            <div className="mx-auto flex h-(--header-height) w-full max-w-(--container-page) items-center gap-6 px-4 md:px-8">
                <SiteLogo size="sm" className="md:hidden" />
                <SiteLogo className="hidden md:flex" />
                <div className="hidden flex-1 justify-center md:flex">
                    <AppNavigationMenu />
                </div>
                <ThemeToggle className="ml-auto md:ml-0" />
            </div>
        </header>
    );
}
