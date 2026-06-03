import Link from "next/link";
import { HeroLogo } from "@/components/composites/hero-logo";

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center md:h-full">
            <HeroLogo src="/logo.svg" className="mx-auto w-70 md:w-[35%] lg:w-[26%]" />
            <h1 className="mt-8 text-5xl font-bold">404</h1>
            <p className="text-muted-foreground mt-4 text-xl">Seite nicht gefunden</p>
            <Link href="/" className="mt-8 underline">
                Zurück zur Startseite
            </Link>
        </div>
    );
}
