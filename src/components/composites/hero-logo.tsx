import type { LogoProps } from "@/components/types/logo.types";
import Image from "next/image";

export function HeroLogo({ alt = "Hero Logo", width = 120, height = 120, ...props }: LogoProps) {
    return <Image alt={alt} width={width} height={height} {...props} />;
}
