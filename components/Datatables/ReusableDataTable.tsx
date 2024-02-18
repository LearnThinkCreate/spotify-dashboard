"use client";
import React, { useMemo } from "react";
import {
    Column,
    useTable,
    useSortBy,
    useGlobalFilter,
    useFilters,
    usePagination,
} from "react-table";
import '@/app/data-tables-css.css';

interface TableColumn {
    Header: string; // Key in the data object
    accessor: string; // Display name for the column
}

interface DataTableProps {
    data: any[];
    columns: TableColumn[];
    defaultPageSize?: number;
}

function ReusableDataTable({ data, columns, defaultPageSize = 10, }: DataTableProps) {
    const memoizedColumns = useMemo(() => columns, []);
    const memoizedData = useMemo(() => data, []);

    const tableInstance = useTable(
        {
            columns: memoizedColumns,
            data: memoizedData,
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
        <section className="data-table-common data-table-two rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark  py-4">
            
            {/* 
                Table header / Search bar 
                Contains the search bar and the dropdown for the number of rows to display
                Flexbos with justify-between to align the elements

                how do I move the search bar to the center? Provide a solution below

            */}
            <div className="flex items-center justify-center border-b border-stroke px-8 pb-4 align-middle">
                
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
                
                {/* 
                    Dropdown for the number of rows to display
                    Flexbox with items-center to align the elements
                */}
                {/* <div className="flex items-center font-medium">
                    <select
                        value={pageSize}
                        onChange={(e) => setPageSize(Number(e.target.value))}
                    >
                        {[5, 10, 25, 50].map((size) => (
                            <option key={size} value={size}>
                                Show {size}
                            </option>
                        ))}
                    </select>
                </div> */}
            </div>

            {/* 
            Class names are set based on the theme
            Table is set to 100% width
            Border collapse is set to collapse
            Break words are set to break
            Table is set to auto overflow
            Padding is set to 4px
            Overflow is set to auto for medium screens and above
            Table is set to fixed for medium screens and above
            Padding is set to 8px for medium screens and above
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




        </section>
    );
}

export default ReusableDataTable;