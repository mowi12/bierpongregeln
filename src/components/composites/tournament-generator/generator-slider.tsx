import type React from "react";

/**
 * Labeled range input. The filled part of the track is driven by the `--range-progress` variable.
 */
export function GeneratorSlider({
    id,
    label,
    value,
    min,
    max,
    unit,
    format,
    onChange,
}: {
    id: string;
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    format?: (v: number) => string;
    onChange: (v: number) => void;
}) {
    const progress = max > min ? ((value - min) / (max - min)) * 100 : 100;

    return (
        <div>
            <div className="flex items-baseline justify-between gap-3">
                <label className="text-[0.9375rem] font-semibold" htmlFor={id}>
                    {label}
                </label>
                <span className="text-primary font-bold tabular-nums">
                    {format ? format(value) : unit ? `${value} ${unit}` : value}
                </span>
            </div>
            <input
                id={id}
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="range-input"
                style={{ "--range-progress": `${progress}%` } as React.CSSProperties}
            />
        </div>
    );
}
