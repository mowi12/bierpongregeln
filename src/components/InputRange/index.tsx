import React from "react";
import Column from "../Column";
import Columns from "../Columns";

interface InputRangeProps {
    min: number;
    max: number;
    step: number;
    startValue: number;
    onChange: (value: number) => void;
    label: string;
}

export default function InputRange(props: InputRangeProps) {
    const { min, max, step, startValue, onChange, label } = props;
    const [value, setValue] = React.useState(startValue);

    function onValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        const value = Number.parseInt(event.target.value);
        if (Number.isNaN(value)) return startValue;
        const result = Math.max(value, min);
        onChange(result);
        return result;
    }

    return (
        <Columns>
            <Column>
                <label htmlFor="textInput">{label}:</label>
            </Column>
            <Column>
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(event) => setValue(onValueChange(event))}
                />
            </Column>
            <Column>
                <input
                    type="number"
                    name="textInput"
                    value={value}
                    onChange={(event) => setValue(onValueChange(event))}
                />
            </Column>
        </Columns>
    );
}
