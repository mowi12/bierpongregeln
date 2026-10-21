import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const logoSrc = "/logo.svg";

const sizes = {
    sm: { image: 40, wordmark: "text-lg" },
    md: { image: 44, wordmark: "text-[1.3125rem]" },
};

export function SiteLogo({
    size = "md",
    className,
}: {
    size?: keyof typeof sizes;
    className?: string;
}) {
    const { image, wordmark } = sizes[size];

    return (
        <Link
            href="/"
            className={cn(
                "focus-visible:ring-ring/50 flex shrink-0 items-center gap-3 rounded-full outline-none focus-visible:ring-[3px]",
                className,
            )}
        >
            <Image priority src={logoSrc} alt="" width={image} height={image} />
            <span className={cn("font-extrabold tracking-[-0.02em]", wordmark)}>
                Bierpongregeln
            </span>
        </Link>
    );
}
