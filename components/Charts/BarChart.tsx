"use client";

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { BaseChartProps } from './definitions';
import { pastel_colors } from './utils';
import ChartWrap from './ChartWrap';
import Loading from '@/components/common/Loader';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function BarChart({
    className = '',
    height,
    chartId = '',
    // defaultDropdownValue = null,
}: BaseChartProps) {

    const [dropdownValue, setDropdownValue] = useState('song');
    const [spotifyData, setSpotifyData] = useState(null);
    const [loading, setLoading] = useState(true);

    const yaxisTitle = 'Hours Played';

    const handleDropdownChange = (value: string) => {
        setDropdownValue(value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams();

            const filters = [
                // dateFilters.dateFilter ? dateFilters.dateFilter : '',
                `${dropdownValue} IS NOT NULL`,
                `${dropdownValue} != ''`,
            ]
            const fields = [dropdownValue, 'SUM(hours_played) AS hours_played'];
            const groupings = getDropdownGroupings(dropdownValue);
            const limit = 10;
            

            // Appending each field individually
            fields.forEach(field => {
                queryParams.append('fields', field);
            });
            filters.forEach(filter => {
                queryParams.append('filters', filter);
            });
            groupings.forEach(grouping => {
                queryParams.append('groupings', grouping);
            });
            queryParams.append('orderBy', 'hours_played DESC');
            queryParams.append('limit', limit.toString());
            queryParams.append('returnType', 'graph');
            queryParams.append('graphColumns', JSON.stringify({
                category: "",
                x_axis: dropdownValue,
                y_axis: "hours_played",
            }));

            try {
                const response = await fetch(`/api/querySpotifyData?${queryParams}`);
                const data = await response.json();
                console.log(data);
                setSpotifyData(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [dropdownValue]);

    const BarGraphOption: ApexOptions = {
        colors: pastel_colors,
        chart: {
            fontFamily: "Satoshi, sans-serif",
            toolbar: {
                show: false,
            },
            selection: {
                enabled: false
            },
            events: {
                click: function (chart, w, e) {
                    // console.log(chart, w, e)
                    console.log('chart ' + chart);
                    console.log(chart);
                    console.log('');
                    console.log('w ' + w);
                    console.log(w);
                    console.log('');
                    console.log('e ' + e);
                    console.log(e);

                }
            },
            id: chartId,
        },
        fill: {
            gradient: {
                // enabled: true,
                opacityFrom: 0.80,
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
            enabled: true,
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
            style: {
                fontSize: '10px',
                fontFamily: undefined
            },
            fixed: {
                enabled: false,
                position: "topRight",
                offsetY: 30,
            },
            marker: {
                show: false,
            },
            fillSeriesColor: false
        },
        plotOptions: {
            bar: {
                horizontal: false,
                distributed: true,
            },
        },
        legend: {
            show: false,
        },
    };



    if (loading) {
        <div className={`${className}`}>
            <Loading />
        </div>

    } else {
        return (
            <ChartWrap
                title={`Top 10 ${getDropdownLabel(dropdownValue)}s`}
                classNames={className}
                dropdownOptions={dropdownOptions}
                onDropdownChange={handleDropdownChange}
                defaultDropdownValue={'song'}
            >
                {spotifyData &&
                    <ApexCharts
                        options={BarGraphOption}
                        series={spotifyData}
                        type="bar"
                        height={height ? height : ''}
                    />
                }
            </ChartWrap>
        );
    }

    // return (
    //     <ChartWrap
    //         title={title}
    //         classNames={className}
    //         dropdownOptions={dropdownOptions}
    //         onDropdownChange={handleDropdownChange}
    //         defaultDropdownValue={'song'}
    //     >
    //         {spotifyData &&
    //             <ApexCharts
    //                 options={BarGraphOption}
    //                 series={spotifyData ? spotifyData : series}
    //                 type="bar"
    //                 height={height ? height : ''}
    //             />
    //         }
    //     </ChartWrap>
    // );
}


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
    },
    {
        category: 'album', groupings: ['album']
    },
    {
        category: 'genre_category', groupings: ['genre_category']
    }
];

function getDropdownLabel(category: string) {
    const words = category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}

const dropdownOptions = CATEGORIES.map((cat) => {
    return { value: cat.category, label: getDropdownLabel(cat.category) };
});

function getDropdownGroupings(category: string) {
    const grouping = CATEGORIES.find((cat) => cat.category === category).groupings;
    return grouping
}