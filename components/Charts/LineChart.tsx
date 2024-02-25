"use client";

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChartProps } from './definitions';
import { pastel_colors } from './utils';
import dynamic from 'next/dynamic';
import ChartWrap from './ChartWrap';
import Loading from '@/components/common/Loader';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function LineChart({
    className = '',
    type = 'line',
    series, 
    // title,
    height,
    // yaxisTitle = 'Hours',
    chartId = '',
    // dropdownOptions = null,
    // onDropdownChange = null,
    defaultDropdownValue = 'main_genre',
}: BaseChartProps) {

    const [dropdownValue, setDropdownValue] = useState(defaultDropdownValue);
    const [spotifyData, setSpotifyData] = useState(series);

    const yaxisTitle = 'Hours Played';

    const handleDropdownChange = (value: string) => {
        setDropdownValue(value);

        const queryParams = new URLSearchParams();

        const filters = '';
        const limit = 10;
        const minYears = 8;
        const timeSelection = 'hours_played';
        const dateGrouping = 'year';

        queryParams.append('returnType', 'graph');

        queryParams.append('fields', value);
        queryParams.append('returnType', 'graph');
        queryParams.append('limit', limit.toString());
        queryParams.append('minYears', minYears.toString());
        queryParams.append('timeSelection', timeSelection);
        queryParams.append('dateGrouping', dateGrouping);
        queryParams.append('filters', filters);



        const fetchData = async () => {
            const res = await fetch(`/api/qualifyingAnnualData?${queryParams.toString()}`);
            const data = await res.json();
            setSpotifyData(data);
        };

        fetchData();

    };


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
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            logarithmic: false,
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
            <ApexCharts 
                options={LineGraphOption} 
                series={spotifyData} 
                type={type} 
                height={height ? height : ''} 
            />
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
