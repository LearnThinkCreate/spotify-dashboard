"use client";

import React, { useEffect, useState } from 'react';
import { ApexOptions } from 'apexcharts';
import { BaseChartProps } from './definitions';
import { pastel_colors } from './utils';
import dynamic from 'next/dynamic';
import ChartWrap from './ChartWrap';
import { usePathname, useSearchParams } from 'next/navigation'
import { generateDateFilters } from '@/db/utils';
import { GraphSeries } from '@/db/utils'; 

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function AudioFeatureChart({
    chartId = '',
    className = '',
    type = 'area',
    height,
}: BaseChartProps) {
    const [spotifyData, setSpotifyData] = useState(null);
    const [yaxisTitle, setYaxisTitle] = useState('');

    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [year, setYear] = useState(null);
    const [month, setMonth] = useState(null);

    const fetchData = async (
        monthFilter: number | any = month,
        yearFilter: number | any = year
    ) => {
        const queryParams = new URLSearchParams();
        const dateFilters = generateDateFilters(monthFilter, yearFilter);
        const timeDuration = dateFilters ? dateFilters.sum_units : "hours";

        setYaxisTitle(timeDuration === 'hours' ? 'Hours Played' : 'Minutes Played');

        let dateGrouping;
        if (monthFilter && yearFilter) {
            dateGrouping = 'day';
        } else if (yearFilter && !monthFilter) {
            dateGrouping = 'month';
        } else {
            dateGrouping = 'year';
        }

        const queryString = `
            select
            ${dateGrouping},
            ROUND(AVG(energy)::numeric, 3) as energy,
            ROUND(AVG(valence)::numeric, 3) as valence,
            ROUND(AVG(speechiness)::numeric, 3) as speechiness,
            ROUND(AVG(instrumentalness)::numeric, 3) as instrumentalness,
            ROUND(AVG(liveness)::numeric, 3) as liveness
            from spotify_data_overview
            ${dateFilters.dateFilter ? `WHERE ${dateFilters.dateFilter}` : ''}
            GROUP BY ${dateGrouping}
            Order by ${dateGrouping} desc;
        `;

        queryParams.append('query', queryString);

        console.log("queryString", queryString);

        try {
            const response = await fetch(`/api/query?${queryParams}`);
            const data = await response.json();
            console.log("data", data);

            const graph = []
            const fields = ['energy', 'valence', 'speechiness', 'instrumentalness', 'liveness'];
          
            fields.forEach((field) => {
              const series = {
                name: field,
                data: []
              }
              data.rows.forEach((row) => {
                series.data.push([row[dateGrouping], row[field]]);
              })
              graph.push(series);
            });
            setSpotifyData(graph);
            console.log("graph", graph);

        } catch (error) {
            console.error("Failed to fetch data:", error);
        }

    };

    useEffect(() => {
        const currentYear = searchParams.get("year") ? Number(searchParams.get("year")) : null;
        const currentMonth = searchParams.get("month") ? Number(searchParams.get("month")) : null;
        setYear(currentYear);
        setMonth(currentMonth);
        fetchData(currentMonth, currentYear);
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
            title={`Audio Features`}
            classNames={className}
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