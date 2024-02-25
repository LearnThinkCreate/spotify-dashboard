"use client"

import React, { useState } from 'react';

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
        <div className={`bg-white border border-stroke dark:bg-boxdark dark:border-strokedark rounded-sm shadow-default px-5 pt-7.5 pb-5 sm:px-7.5 ${classNames}`}>
            <div className={` ${dropdownOptions ? 'flex flex-row gap-2 items-center justify-between mb-6' : 'flex items-center justify-center'}`}>
                {title && <div className={`${dropdownOptions ? 'flex ' : 'flex items-center justify-center'}`}><h2 className="text-sm sm:text-xl font-bold">{title}</h2></div>}
                {dropdownOptions && (
                    <div className="flex ">
                        <div className="relative z-20 inline-block">
                            <select
                                value={selectedValue}
                                onChange={handleDropdownChange}
                                className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 font-medium outline-none text-xs sm:text-lg"
                            >
                                {dropdownOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                            <span className="absolute top-1/2 right-1 z-10 -translate-y-1/2">
                                <svg
                                    width="18"
                                    height="18"
                                    viewBox="0 0 18 18"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M8.99995 12.8249C8.8312 12.8249 8.69058 12.7687 8.54995 12.6562L2.0812 6.2999C1.82808 6.04678 1.82808 5.65303 2.0812 5.3999C2.33433 5.14678 2.72808 5.14678 2.9812 5.3999L8.99995 11.278L15.0187 5.34365C15.2718 5.09053 15.6656 5.09053 15.9187 5.34365C16.1718 5.59678 16.1718 5.99053 15.9187 6.24365L9.44995 12.5999C9.30933 12.7405 9.1687 12.8249 8.99995 12.8249Z"
                                        fill="#64748B"
                                    />
                                </svg>
                            </span>
                        </div>
                    </div>
                )}
            </div>
            <div>
                {children}
            </div>
        </div>
    );
}

export default ChartWrap;
