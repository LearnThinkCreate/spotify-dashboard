"use client";

import React, { useState } from 'react';

interface DropdownProps {
    dropdownOptions: Array<{ value: string; label: string }>;
    selectedValue: string;
    onDropdownChange: (e:  React.ChangeEvent<HTMLSelectElement>) => void;
    name?: string;
}

const Dropdown: React.FC<DropdownProps> = ({ dropdownOptions, selectedValue, onDropdownChange, name }) => {
    return (
        <div className="">
            <div className="relative z-20 inline-block">
                <select
                    name={name}
                    value={selectedValue}
                    onChange={onDropdownChange}
                    className="relative z-20 inline-flex appearance-none bg-transparent py-1 pl-3 pr-8 outline-none text-xs sm:text-lg"
                >
                    {dropdownOptions.map(option => (
                        <option key={option.value} value={option.value} className="text-xs sm:text-large">{option.label}</option>
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
    )
};

export default Dropdown;

