"use client";

import { useEffect } from "react";
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
        <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
            <h1 className="text-3xl font-bold">Etwas ist schiefgelaufen</h1>
            <p className="text-muted-foreground mt-4 max-w-md text-lg">
                Beim Laden dieser Seite ist ein unerwarteter Fehler aufgetreten.
            </p>
            <Button className="mt-8" onClick={reset}>
                Erneut versuchen
            </Button>
        </div>
    );
}
