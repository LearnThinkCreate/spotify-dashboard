"use client";
import React, { useMemo, useState, useEffect } from "react";
import {
    Column,
    useTable,
    useSortBy,
    useGlobalFilter,
    useFilters,
    usePagination,
} from "react-table";
import '@/app/data-tables-css.css';
import { formatColumnValues } from "@/db/utils";

interface TableColumn {
    Header: string; // Key in the data object
    accessor: string; // Display name for the column
}

interface DataTableProps {
    data?: any[];
    columns?: TableColumn[];
    defaultPageSize?: number;
    defaultDropdownValue?: string;
    classNames?: string;
}

function ReusableDataTable({
    data,
    columns,
    defaultPageSize = 10,
    defaultDropdownValue,
    classNames,
}: DataTableProps
) {
    const [selectedValue, setSelectedValue] = useState(defaultDropdownValue || (dropdownOptions ? dropdownOptions[0].value : null));
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);

    function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setSelectedValue(value);
    }

    useEffect(() => {
        const queryParams = new URLSearchParams();

        const timeDuration = 'hours';
        const timeSelection = 'hours_played';
        const groupings = getDropdownGroupings(selectedValue);

        const sqlQuery = `
            SELECT
                ${selectedValue},
                ROUND(SUM(${timeSelection})::numeric, 2) AS ${timeSelection}
            FROM spotify_data_overview
            WHERE (${selectedValue} IS NOT NULL AND ${selectedValue} != '') 
            GROUP BY ${groupings.join(', ')}
            ORDER BY ${timeSelection} DESC
            LIMIT 50
        `;

        queryParams.append('query', sqlQuery); 

        const fetchData = async () => {
            try {
                const response = await fetch(`/api/query?${queryParams}`);
                const data = await response.json();
                data.rows.forEach((row) => {
                    row[selectedValue] = row[selectedValue] ? row[selectedValue].replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Unknown';
                });
                setTableData(data.rows);
                setTableColumns(formatColumnValues({ data }));

            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, [selectedValue]);

    const tableInstance = useTable(
        {
            columns: tableColumns,
            data: tableData,
            initialState: { pageSize: defaultPageSize }
        },
        useFilters,
        useGlobalFilter,
        useSortBy,
        usePagination
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        state,
        setGlobalFilter,
        nextPage,
        previousPage,
        canNextPage,
        canPreviousPage,
        pageOptions,
        setPageSize,
        gotoPage,
    } = tableInstance;

    const { globalFilter, pageIndex, pageSize } = state;

    return (
        // Background color and border color are set based on the theme
        <div className={
            `data-table-common data-table-two rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark py-4 ${classNames}`}>

            {/* 
                Table header / Search bar 
                Contains the search bar and the dropdown for the number of rows to display
            */}
            <div className="flex items-center justify-between border-b border-stroke px-8 pb-4 align-middle gap-2 sm:gap-10">

                <div className="w-full max-w-md">
                    <input
                        type="text"
                        value={globalFilter || ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        placeholder={"Search"}
                        // Styling for the search bar
                        // Border, focus border, rounded corners, padding
                        // Width is set to 100%
                        // Outline is set to none
                        className="border border-stroke focus:border-primary outline-none rounded-md w-full px-5 py-2.5"
                    />
                </div>

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

            {/* 
                Table body 
                Contains the table itself
            */}
            <table
                {...getTableProps()}
                className="datatable-table w-full border-collapse break-words table-auto overflow-hidden px-4 md:overflow-auto md:table-fixed md:px-8"
            >
                <thead>
                    {headerGroups.map((headerGroup) => {
                        const { key, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
                        return (
                            <tr key={key} {...restHeaderGroupProps}>
                                {headerGroup.headers.map((column) => {
                                    const { key: headerKey, ...restHeaderProps } = column.getHeaderProps(column.getSortByToggleProps());
                                    return (
                                        <th key={headerKey} {...restHeaderProps}>

                                            {/* 
                                        Flexbox with items-center to align the elements
                                        Column header text
                                        If the column is sorted, display the sort icon
                                    */}
                                            <div className="flex items-center justify-center">
                                                <span>{column.render("Header")}</span>
                                                {/* 
                                        Add space between the column header text and the sort icon
                                        */}
                                                <div className="inline-flex flex-col space-y-[2px] ml-2">
                                                    {/*  Up arrow */}
                                                    <span className="inline-block">
                                                        <svg
                                                            className="fill-current"
                                                            width="10"
                                                            height="5"
                                                            viewBox="0 0 10 5"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path d="M5 0L0 5H10L5 0Z" fill="" />
                                                        </svg>
                                                    </span>
                                                    {/*  Down arrow */}
                                                    <span className="inline-block">
                                                        <svg
                                                            className="fill-current"
                                                            width="10"
                                                            height="5"
                                                            viewBox="0 0 10 5"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                        >
                                                            <path
                                                                d="M5 5L10 0L-4.37114e-07 8.74228e-07L5 5Z"
                                                                fill=""
                                                            />
                                                        </svg>
                                                    </span>
                                                </div>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </thead>

                <tbody {...getTableBodyProps()}>
                    {page.map((row) => {
                        prepareRow(row);
                        const { key: rowKey, ...restRowProps } = row.getRowProps();
                        return (
                            <tr key={rowKey} {...restRowProps}>
                                {row.cells.map((cell) => {
                                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                                    return (
                                        <td key={cellKey} {...restCellProps}>
                                            {cell.render("Cell")}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            <div className="flex justify-center px-8 pt-5 border-t border-stroke">
                <div className="flex">
                    {/* Conditionally render jump to first page if not near the start */}
                    {pageIndex > 2 && (
                        <button
                            className="p-1 px-2 rounded-md cursor-pointer hover:text-white hover:bg-primary flex items-center justify-center"
                            onClick={() => gotoPage(0)}
                        >
                            {"<<"}
                        </button>
                    )}

                    {/* Previous page button */}
                    <button
                        className="p-1 px-2 rounded-md cursor-pointer hover:text-white hover:bg-primary flex items-center justify-center"
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        {"<"}
                    </button>

                    {/* Dynamically generated page buttons, with logic to show/hide first and last pages */}
                    {pageOptions
                        .filter(page => {
                            return (page >= pageIndex - 1 && page <= pageIndex + 1) || // pages around current page
                                (pageIndex < 3 && page < 4) || // if at the start, show first 4 pages
                                (pageIndex > pageOptions.length - 4 && page > pageOptions.length - 5); // if at the end, show last 4 pages
                        })
                        .reduce((acc, page, index, filteredPages) => {
                            if (index > 0 && page - filteredPages[index - 1] > 1) {
                                acc.push("...");
                            }
                            acc.push(page);
                            return acc;
                        }, [])
                        .map((page, index) => (
                            page === "..." ? (
                                <div key={index} className="px-3 flex items-center justify-center">...</div>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => gotoPage(page)}
                                    className={`${pageIndex === page ? "text-white bg-primary" : ""
                                        } p-1 px-3 rounded-md cursor-pointer hover:text-white hover:bg-primary flex items-center justify-center mx-1`}
                                >
                                    {page + 1}
                                </button>
                            )
                        ))}

                    {/* Next page button */}
                    <button
                        className="p-1 px-2 rounded-md cursor-pointer hover:text-white hover:bg-primary flex items-center justify-center"
                        onClick={() => nextPage()}
                        disabled={!canNextPage}
                    >
                        {">"}
                    </button>

                    {/* Conditionally render jump to last page if not near the end */}
                    {pageIndex < pageOptions.length - 3 && (
                        <button
                            className="p-1 px-2 rounded-md cursor-pointer hover:text-white hover:bg-primary flex items-center justify-center"
                            onClick={() => gotoPage(pageOptions.length - 1)}
                        >
                            {">>"}
                        </button>
                    )}
                </div>
            </div>




        </div>
    );
}

export default ReusableDataTable;


const CATEGORIES = [
    {
        category: 'artist', groupings: ['artist', 'artist_id']
    },
    {
        category: 'main_genre', groupings: ['main_genre']
    },
    {
        category: 'secondary_genre', groupings: ['secondary_genre']
    },
    {
        category: 'song', groupings: ['song', 'track_id']
    }
]

const getDropdownLabel = (value: string) => {
    const words = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

export const dropdownOptions = CATEGORIES.map((cat) => {
    return { value: cat.category, label: getDropdownLabel(cat.category) };
});


function getDropdownGroupings(category: string) {
    const grouping = CATEGORIES.find((cat) => cat.category === category).groupings;
    return grouping
}

