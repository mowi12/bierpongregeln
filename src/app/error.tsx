"use client";

import { useEffect } from "react";
import { HeroSplash } from "@/components/composites/hero-splash";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <HeroSplash
            title="Etwas ist schiefgelaufen"
            description="Beim Laden dieser Seite ist ein unerwarteter Fehler aufgetreten."
        >
            <Button size="lg" onClick={reset}>
                Erneut versuchen
            </Button>
        </HeroSplash>
    );
}
