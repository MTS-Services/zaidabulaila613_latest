"use client";

import React, { useState, useEffect, useRef } from "react";

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: Option[];
    placeholder?: string;
    label?: string;
    onSelect?: (value: string) => void;
    defaultValue?: string | null;
    error?:string | null
}

const Select: React.FC<CustomSelectProps> = ({
    options,
    placeholder = "Select an option...",
    label,
    onSelect,
    defaultValue,
    error
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleOptionClick = (option: Option) => {
        setSelectedOption(option);
        setIsOpen(false);
        setSearchTerm("");
        if (onSelect) {
            onSelect(option.value);
        }
    };

    const filteredOptions = options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (defaultValue) {
            const findOption = options.find((el) => el.value === defaultValue)
            if (findOption) {
                handleOptionClick(findOption)

            }
            console.log(defaultValue, "DEFAULT")
        }
    }, [defaultValue])



    return (
        <div className="relative w-full">
            {label &&
                <label className="block text-sm font-medium leading-6 text-gray-900 mb-2">
                    {label}
                </label>

            }
            {/* Input Field */}
            <div ref={dropdownRef}>
                <input
                    type="text"
                    placeholder={selectedOption?.label || placeholder}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => setIsOpen(true)}
                    className="block w-full max-w-[500px] rounded-md border-0 pl-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />

                {/* Dropdown Options */}
                {isOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-[300px] overflow-y-auto shadow-lg text-sm">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <li
                                    key={option.value}
                                    onClick={() => handleOptionClick(option)}
                                    className="px-4 py-2 hover:bg-primary hover:text-white cursor-pointer"
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No options found</li>
                        )}
                    </ul>
                )}

            </div>
            {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
    );
};

export default Select;
