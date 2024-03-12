"use client"

import React, { useState } from 'react';
import Dropdown from '@/ui/Dropdowns/Dropdown';

interface ChartWrapProps {
    title: string;
    classNames?: string;
    children: React.ReactNode;
    dropdownOptions?: Array<{ value: string; label: string }>;
    onDropdownChange?: (value: string) => void;
    defaultDropdownValue?: string;
}

const ChartWrap: React.FC<ChartWrapProps> = ({ 
    title, 
    classNames, 
    children, 
    dropdownOptions, 
    onDropdownChange, 
    defaultDropdownValue
}) => {
    const [selectedValue, setSelectedValue] = useState(
        defaultDropdownValue || (dropdownOptions ? dropdownOptions[0].value : null)
      );

    const handleDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
        if (onDropdownChange) {
            onDropdownChange(value);
        }
    };

    return (
        <div className={`bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default px-3 pt-7.5 pb-5 sm:px-4 ${classNames}`}>
            <div className={` ${dropdownOptions ? 'flex flex-row gap-2 items-center justify-between mb-6' : 'flex items-center justify-center'}`}>
                {title && <div className={`${dropdownOptions ? 'flex ' : 'flex items-center justify-center'}`}><h2 className="text-sm sm:text-xl font-bold">{title}</h2></div>}
                {dropdownOptions && (
                    <Dropdown
                        dropdownOptions={dropdownOptions}
                        selectedValue={selectedValue}
                        onDropdownChange={handleDropdownChange}
                    />
                )}
            </div>
            <div className="h-full grid grid-cols-1 content-center">
            <div className="">
                {/* <span className="block w-full align-middle"> */}
                {children}
                {/* </span> */}
            </div>
            </div>
        </div>
    );
}

export default ChartWrap;
