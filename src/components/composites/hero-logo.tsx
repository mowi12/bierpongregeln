import Image from "next/image";
import type { LogoProps } from "@/components/types/logo.types";

export function HeroLogo({ alt = "Hero Logo", width = 120, height = 120, ...props }: LogoProps) {
    return <Image alt={alt} width={width} height={height} {...props} />;
}
