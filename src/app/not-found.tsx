import Link from "next/link";
import { HeroSplash } from "@/components/composites/hero-splash";
import { Button } from "@/components/ui/button";

export default function NotFound() {
    return (
        <HeroSplash title="404" description="Seite nicht gefunden">
            <Button asChild size="lg">
                <Link href="/">Zurück zur Startseite</Link>
            </Button>
        </HeroSplash>
    );
}
