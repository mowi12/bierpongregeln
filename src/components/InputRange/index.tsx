import { ChangeEvent, useState } from "react";
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
    const [value, setValue] = useState(startValue);
    const [inputValue, setInputValue] = useState<string>(value.toString());

    // Handle slider change
    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        setValue(newValue);
        setInputValue(newValue.toString()); // keep the text input synchronized
        onChange(newValue); // call the parent's onChange function
    };

    // Handle text input change
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue); // update input state to reflect the typed value
        const numValue = Number(newValue);
        if (!isNaN(numValue) && numValue >= min) {
            setValue(numValue); // set state to valid value
            onChange(numValue); // call the parent's onChange function
        }
    };

    // Handle text input blur (validate and set value when focus is lost)
    const handleInputBlur = () => {
        const numValue = Number(inputValue);
        if (!isNaN(numValue) && numValue >= min) {
            setValue(numValue); // set state to valid value
            onChange(numValue); // call the parent's onChange function
        } else {
            setInputValue(value.toString()); // reset input to the current valid value
            onChange(value); // call the parent's onChange function
        }
    };

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
                    id="sliderInput"
                    value={value}
                    onChange={handleSliderChange}
                />
            </Column>
            <Column>
                <input
                    type="number"
                    name="textInput"
                    id="textInput"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                />
            </Column>
        </Columns>
    );
}
