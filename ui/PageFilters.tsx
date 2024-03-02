"use client";

import React, { useState, useEffect } from "react";
import Dropdown from "@/components/Dropdowns/Dropdown";
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function PageFilters({
    
}) {
    const searchParams = useSearchParams();
    const { replace } = useRouter();
    const pathname = usePathname();

    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');

    useEffect(() => {
        setYear(searchParams.get("year"));
        setMonth(searchParams.get("month"));
      }, [pathname, searchParams])

    const handleDropdownChange = (e) => {
        const params = new URLSearchParams(searchParams.toString());

        const { name, value } = e.target;
        if (name === "year") {
            if (value === "all") {
                setYear(null);
                params.delete("year");
            } else {
                setYear(value);
                params.set("year", value);
            }
        } else {
            if (value === "all") {
                setMonth(null);
                params.delete("month");
            } else {
                setMonth(value);
                params.set("month", value);
            }
        }

        replace(`${pathname}?${params.toString()}`, { scroll: false });
    }


    return (
        <div className="grid grid-cols-2 gap-4 grow xl:grid-cols-none xl:flex-col ">
            <div className="border rounded-lg p-1 flex justify-between items-center xl:border-none xl:p-0 xl:h-1/2">
                <h2 className="text-xs sm:text-lg">Year Filter</h2>
                <Dropdown
                    dropdownOptions={yearDropdownOptions}
                    selectedValue={year ? year : "all"}
                    onDropdownChange={handleDropdownChange}
                    name="year"
                />
            </div>
            <div className="border xl:border-none rounded-lg p-1 xl:p-0 flex justify-between items-center xl:h-1/2">
                <h2 className="text-xs sm:text-lg">Month Filter</h2>
                <Dropdown
                    dropdownOptions={monthDropdownOptions}
                    selectedValue={month ? month : "all"}
                    onDropdownChange={handleDropdownChange}
                    name="month"
                />
            </div>
        </div>
  
    );


}

// Create Dropdown Options for Year and Month
// Years: 2014-2023
// Months: January-December

const yearDropdownOptions = [
    { value: "all", label: "All" },
    ...Array.from({ length: 10 }, (_, i) => {
        const year = 2014 + i;
        return { value: year.toString(), label: year.toString() };
    })
];

const months = {
    1: "January",
    2: "February",
    3: "March",
    4: "April",
    5: "May",
    6: "June",
    7: "July",
    8: "August",
    9: "September",
    10: "October",
    11: "November",
    12: "December",
};

const monthDropdownOptions = [
    { value: "all", label: "All" },
    ...Object.entries(months).map(([value, label]) => ({
        value,
        label,
    }))
];

