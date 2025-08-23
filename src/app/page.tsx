import { HeroLogo } from "@/components/composites/hero-logo";

const heroLogoSrc = "/logo.svg";

export default function Home() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center md:h-full">
            <HeroLogo src={heroLogoSrc} className="mx-auto w-70 md:w-[35%] lg:w-[26%]" />
            <h1 className="mt-8 text-5xl font-bold">Bierpongregeln</h1>
            <p className="text-muted-foreground mt-4 text-xl">Die beste Bierpongregelsammlung!</p>
        </div>
    );
}
