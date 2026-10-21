import { createCn } from "cn/config";

// Custom font sizes from globals.css. Without them `text-label` and friends would be treated as
// colors and dropped when a text color like `text-muted-foreground` follows.
const customFontSizes = ["hero", "title", "lead", "label", "card-title", "rule"].flatMap((size) => [
    size,
    `${size}-lg`,
]);

export const cn = createCn({ extend: { theme: { text: customFontSizes } } });
