import { HeroLogo } from "@/components/composites/hero-logo";

const heroLogoSrc = "/logo.svg";

export default function ComingSoon() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center md:h-full">
            <HeroLogo src={heroLogoSrc} className="mx-auto w-70 md:w-[35%] lg:w-[26%]" />
            <h1 className="mt-8 text-5xl font-bold">Coming Soon</h1>
        </div>
    );
}
