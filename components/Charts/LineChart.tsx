"use client";

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChartProps } from './definitions';
import { pastel_colors } from './utils';
import dynamic from 'next/dynamic';
import ChartWrap from './ChartWrap';
import { usePathname, useSearchParams } from 'next/navigation'
import { generateDateFilters } from '@/db/utils';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function LineChart({
    className = '',
    type = 'line',
    // series,
    // title,
    height,
    // yaxisTitle = 'Hours',
    chartId = '',
    // dropdownOptions = null,
    // onDropdownChange = null,
    defaultDropdownValue = 'main_genre',
}: BaseChartProps) {

    const [dropdownValue, setDropdownValue] = useState(defaultDropdownValue);
    const [spotifyData, setSpotifyData] = useState();
    const [yaxisTitle, setYaxisTitle] = useState('');

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
        const defaultFilters = [`${value} IS NOT NULL`, `${value} != ''`];

        setYaxisTitle(timeDuration === 'hours' ? 'Hours Played' : 'Minutes Played');

        const limit = 10;
        const minYears = !(yearFilter || monthFilter) ? '8' : null;

        let dateGrouping;
        if (monthFilter && yearFilter) {
            dateGrouping = 'day';
        } else if (yearFilter && !monthFilter) {
            dateGrouping = 'month';
        } else {
            dateGrouping = 'year';
        }

        let filters = defaultFilters;
        if (dateFilters.dateFilter !== null) {
            filters.push(dateFilters.dateFilter);
        }

        queryParams.append('returnType', 'graph');

        queryParams.append('fields', value);
        queryParams.append('returnType', 'graph');
        queryParams.append('limit', limit.toString());
        queryParams.append('minYears', minYears);
        queryParams.append('timeSelection', timeSelection);
        queryParams.append('dateGrouping', dateGrouping);
        filters.forEach((filter) => {
            queryParams.append('filters', filter);
        });

        const res = await fetch(`/api/qualifyingAnnualData?${queryParams.toString()}`);
        const data = await res.json();
        setSpotifyData(data);
    };

    const handleDropdownChange = (value: string) => {
        setDropdownValue(value);
        fetchData(value);
    };

    useEffect(() => {
        const currentYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
        const currentMonth = searchParams.get("month") ? Number(searchParams.get("month")) : null;
        const value = dropdownValue ? dropdownValue : defaultDropdownValue;
        setYear(currentYear);
        setMonth(currentMonth);
        fetchData(value, currentYear, currentMonth);
    }, [pathname, searchParams])


    const LineGraphOption: ApexOptions = {
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "center",
        },
        colors: pastel_colors,
        chart: {
            fontFamily: "Satoshi, sans-serif",
            // height: 310,
            toolbar: {
                show: false,
            },
            id: chartId,
        },
        fill: {
            gradient: {
                // enabled: true,
                opacityFrom: 0.55,
                opacityTo: 0,
            },
        },
        responsive: [
            {
                breakpoint: 1024,
                options: {
                    chart: {
                        height: 300,
                    },
                },
            },
            {
                breakpoint: 1366,
                options: {
                    chart: {
                        height: 320,
                    },
                },
            },
        ],
        stroke: {
            width: [2, 2],
            curve: "smooth",
        },

        markers: {
            size: 0,
        },
        grid: {
            strokeDashArray: 7,
            xaxis: {
                lines: {
                    show: false,
                },
            },
            yaxis: {
                lines: {
                    show: false,
                },
            },
        },
        dataLabels: {
            enabled: false,
        },
        xaxis: {
            type: "datetime",
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            title: {
                style: {
                    fontSize: "10px",
                    fontFamily: undefined,
                },
                text: yaxisTitle,
                rotate: -90,
            },
        },
        tooltip: {
            enabled: true,
            shared: false,
            style: {
                fontSize: '10px',
                fontFamily: undefined
            },
            fixed: {
                enabled: false,
                position: "topRight",
                offsetY: 30,
            },
            x: {
                show: false,
            },
            y: {
                title: {
                    formatter: (seriesName: string) => seriesName,
                },
            },
            marker: {
                show: false,
            },
            fillSeriesColor: false
        },
    };

    return (
        <ChartWrap
            title={`Top ${10} ${getDropdownLabel(dropdownValue)}s`}
            classNames={className}
            dropdownOptions={dropdownOptions}
            onDropdownChange={handleDropdownChange}
            defaultDropdownValue={defaultDropdownValue}
        >
            {
                spotifyData && (
                    <ApexCharts
                        options={LineGraphOption}
                        series={spotifyData ? spotifyData : []}
                        type={type}
                        height={height ? height : ''}
                    />
                )
            }
        </ChartWrap>
    );
}

const CATEGORIES = [
    "main_genre",
    "secondary_genre",
    "artist",
    "album",
    "song",
    "genre_category",
]

// Get the label for the dropdown value
export const getDropdownLabel = (value: string) => {
    const words = value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
};

// Create Dropdown options for the CategoryLineGraph, Split underscore and Capitalize the first letter of each category
export const dropdownOptions = CATEGORIES.map((category) => {
    return {
        value: category,
        label: getDropdownLabel(category),
    };
});
