"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select";

export const GraphDropDown = ({ 
    options,
    value,
    onValueChange,
}) => {
    return (
        <Select 
        defaultValue={value} 
        onValueChange={onValueChange}
        >
        <SelectTrigger 
        className="w-[180px] bg-card text-card-foreground"
        >
            <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
            {options.map((option) => (
                <SelectItem value={option.value} key={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
    );
}