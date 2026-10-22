import { Search, X } from "lucide-react";
import type React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/**
 * Presentational search input with a leading icon, a clear button and an optional keyboard
 * shortcut hint. State is owned by the caller.
 */
export function SearchField({
    id,
    label,
    value,
    onValueChange,
    onKeyDown,
    inputRef,
    placeholder,
    shortcut,
    className,
}: {
    id: string;
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
    inputRef?: React.Ref<HTMLInputElement>;
    placeholder?: string;
    shortcut?: string;
    className?: string;
}) {
    return (
        <div className={cn("relative", className)}>
            <label htmlFor={id} className="sr-only">
                {label}
            </label>
            <Search
                aria-hidden="true"
                className="text-muted-foreground pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2"
            />
            <Input
                ref={inputRef}
                id={id}
                type="search"
                autoComplete="off"
                enterKeyHint="search"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onValueChange(event.target.value)}
                onKeyDown={onKeyDown}
                className="pr-12 pl-11 [&::-webkit-search-cancel-button]:hidden"
            />
            {value ? (
                <button
                    type="button"
                    aria-label="Suche leeren"
                    onClick={() => onValueChange("")}
                    className="text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring/50 absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-full transition-colors duration-150 outline-none focus-visible:ring-[3px]"
                >
                    <X className="size-5" />
                </button>
            ) : (
                shortcut && (
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-1/2 right-4 hidden -translate-y-1/2 lg:block"
                    >
                        <kbd className="text-muted-foreground rounded-md border px-2 py-0.5 font-sans text-xs font-semibold">
                            {shortcut}
                        </kbd>
                    </span>
                )
            )}
        </div>
    );
}
