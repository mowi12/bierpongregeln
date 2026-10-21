import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Custom font sizes from globals.css. Without them tailwind-merge treats e.g. `text-label` as a
// color and drops it when a text color like `text-muted-foreground` follows.
const customFontSizes = ["hero", "title", "lead", "label", "card-title", "rule"].flatMap((size) => [
    size,
    `${size}-lg`,
]);

const twMerge = extendTailwindMerge({ extend: { theme: { text: customFontSizes } } });

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
