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
import { formatColumnValues } from "@/lib/db/utils";
import Dropdown from "@/ui/Dropdowns/Dropdown";
import { usePathname, useSearchParams } from 'next/navigation'
import { generateDateFilters } from '@/ui/utils';

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
    // data,
    columns,
    defaultPageSize = 5,
    defaultDropdownValue,
    classNames,
}: DataTableProps
) {
    const [selectedValue, setSelectedValue] = useState(defaultDropdownValue || (dropdownOptions ? dropdownOptions[0].value : null));
    const [tableData, setTableData] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);

    const fetchData = async (
        value: string,
        yearFilter: number | any = year,
        monthFilter: number | any = month
    ) => {
        
        const queryParams = new URLSearchParams();

        const dateFilters = generateDateFilters(monthFilter, yearFilter);
        const timeDuration = dateFilters ? dateFilters.sum_units : "hours";
        const timeSelection = timeDuration === "hours" ? "hours_played" : "minutes_played";
        const groupings = getDropdownGroupings(value);

        const sqlQuery = `
            SELECT
                ${value},
                ROUND(SUM(${timeSelection})::numeric, 2) AS ${timeSelection}
            FROM spotify_data_overview
            WHERE (${value} IS NOT NULL AND ${value} != '' ${
            dateFilters.dateFilter ? `AND ${dateFilters.dateFilter}` : ''
            }) 
            GROUP BY ${groupings.join(', ')}
            ORDER BY ${timeSelection} DESC
            LIMIT 50
        `;

        queryParams.append('query', sqlQuery);

        try {
            const response = await fetch(`/api/query?${queryParams}`);
            const data = await response.json();
            data.rows.forEach((row) => {
                row[value] = row[value] ? row[value].replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Unknown';
            });
            setTableData(data.rows);
            setTableColumns(formatColumnValues({ data }));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
    }

    function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        setSelectedValue(value);
        fetchData(value);
    }

    useEffect(() => {
        const currentYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
        const currentMonth = searchParams.get("month") ? Number(searchParams.get("month")) : null;
        const value = selectedValue ? selectedValue : defaultDropdownValue;
        setYear(currentYear);
        setMonth(currentMonth);
        fetchData(value, currentYear, currentMonth);
    }, [pathname, searchParams])


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
                    <Dropdown
                        dropdownOptions={dropdownOptions}
                        selectedValue={selectedValue}
                        onDropdownChange={handleDropdownChange}
                    />
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
        category: 'song', groupings: ['song']
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

