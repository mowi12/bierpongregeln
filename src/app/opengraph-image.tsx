import { ImageResponse } from "next/og";
import { SocialImageContent, socialImageAlt, socialImageSize } from "@/lib/social-image";

export const alt = socialImageAlt;
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(<SocialImageContent />, size);
}
