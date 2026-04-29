import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const logoSrc = "/logo.svg";

export function NavbarLogo({ className }: { className?: string }) {
    return (
        <Link href="/" className={cn("flex items-center space-x-2", className)}>
            <Image
                src={logoSrc}
                alt="Bierpongregeln Logo"
                width={40}
                height={40}
                className="rounded-full"
            />
            <span className="hidden text-lg font-bold xl:inline-block">Bierpongregeln</span>
        </Link>
    );
}
