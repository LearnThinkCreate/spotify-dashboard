"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { GraphOption, getOptions } from "@/components/graphics/options";

interface GraphDropDownProps {
    paramValue: string;
  }

const GraphDropDown: React.FC<GraphDropDownProps> = ({ paramValue }) => {


    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = React.useState(false);
    const [defaultValue, setDefaultValue] = React.useState('');

    const options: GraphOption[] = getOptions(paramValue);

    React.useEffect(() => {
        setMounted(true);
        setDefaultValue(searchParams.get(paramValue) || options[0].value);
    }, []);

    const handleDropDownChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set(paramValue, value);
        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }

    if (!mounted) return null;
    return (
        <Select 
        defaultValue={defaultValue} 
        onValueChange={handleDropDownChange}
        >
        <SelectTrigger 
        className="w-[180px] bg-card text-card-foreground"
        >
            <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
            {options.map((option) => (
                <SelectItem value={option.value} key={paramValue + '-' + option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
        </Select>
    );
};

export default GraphDropDown;
