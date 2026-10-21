export const THEME_STORAGE_KEY = "theme";

export type ThemePreference = "light" | "dark";

/**
 * Inlined into <head> so the correct theme class is set before the first paint.
 * Without a stored preference the system setting is followed, also when it changes later.
 */
export const themeInitScript = `(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const stored = () => {
        try {
            return localStorage.getItem("${THEME_STORAGE_KEY}");
        } catch {
            return null;
        }
    };
    const apply = () => {
        const preference = stored();
        root.classList.toggle("dark", preference ? preference === "dark" : media.matches);
    };
    apply();
    media.addEventListener("change", apply);
})();`;

function readStoredPreference(): string | null {
    try {
        return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
        return null;
    }
}

/**
 * Re-applies the theme on the client, mirroring `themeInitScript`. Needed in development, where
 * React's Strict Mode remount resets the attributes of `<html>`; a no-op in production.
 */
export function syncTheme() {
    const preference = readStoredPreference();
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle(
        "dark",
        preference ? preference === "dark" : prefersDark,
    );
}

/**
 * Applies and persists an explicit theme choice. Transitions are suppressed during the switch
 * so all colors change at once.
 */
export function applyTheme(preference: ThemePreference) {
    const root = document.documentElement;
    root.classList.add("theme-switching");
    root.classList.toggle("dark", preference === "dark");

    try {
        localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
        // Storage can be unavailable (e.g. private mode); the choice then lasts for this page only.
    }

    requestAnimationFrame(() => {
        requestAnimationFrame(() => root.classList.remove("theme-switching"));
    });
}
