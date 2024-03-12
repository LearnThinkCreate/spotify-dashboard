"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { BaseChartProps } from "./definitions";
import { pastel_colors } from "./utils";
import ChartWrap from "./ChartWrap";
import { usePathname, useSearchParams } from "next/navigation";
import { generateDateFilters } from "@/ui/utils";
import { searchSpotifyData } from "@/lib/db/querySpotifyData";
import { formatQueryReturn } from "@/lib/db/utils";

const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarChart({
  className = "",
  // series,
  height,
  chartId = "",
  defaultDropdownValue = null,
  initialYaxisTitle = "Hours Played",
}: BaseChartProps) {
  const [dropdownValue, setDropdownValue] = useState(defaultDropdownValue);
  const [spotifyData, setSpotifyData] = useState();
  const [yaxisTitle, setYaxisTitle] = useState(initialYaxisTitle);

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
    const timeSelection =
    dateFilters.sum_units === "hours" ? "hours_played" : "minutes_played";

    setYaxisTitle(dateFilters.sum_units === "hours" ? "Hours Played" : "Minutes Played");

    const filters = [
      `${value} IS NOT NULL`,
      `${value} != ''`,
    ];

    if (dateFilters.dateFilter) {
      filters.push(dateFilters.dateFilter);
    }

    const fields = [value, `SUM(${timeSelection}) AS ${timeSelection}`];
    const groupings = getDropdownGroupings(value);
    const limit = 10;

    const queryString = searchSpotifyData({
      fields,
      filters,
      groupings,
      orderBy: [`${timeSelection} DESC`],
      limit,
    });
    queryParams.append("query", queryString);

    const response = await fetch(`/api/query?${queryParams}`);
    const data = await response.json();
    const formattedData = formatQueryReturn({
      data,
      returnType: "graph",
      graphColumns: { category: "", x_axis: value, y_axis: `${timeSelection}` },
    });
    setSpotifyData(formattedData);
  };

  useEffect(() => {
    const currentYear = searchParams.get("year")
      ? Number(searchParams.get("year"))
      : null;
    const currentMonth = searchParams.get("month")
      ? Number(searchParams.get("month"))
      : null;
    const value = dropdownValue ? dropdownValue : defaultDropdownValue;
    setYear(currentYear);
    setMonth(currentMonth);
    fetchData(value, currentYear, currentMonth);
  }, [pathname, searchParams]);

  const handleDropdownChange = (value: string) => {
    setDropdownValue(value);
    fetchData(value);
  };

  const BarGraphOption: ApexOptions = {
    colors: pastel_colors,
    chart: {
      fontFamily: "Satoshi, sans-serif",
      toolbar: {
        show: false,
      },
      selection: {
        enabled: false,
      },
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
          // console.log('chart ' + chart);
          // console.log(chart);
          // console.log('');
          // console.log('w ' + w);
          // console.log(w);
          // console.log('');
          // console.log('e ' + e);
          // console.log(e);
        },
      },
      id: chartId,
    },
    fill: {
      gradient: {
        // enabled: true,
        opacityFrom: 0.8,
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
        fontSize: "10px",
        fontFamily: undefined,
      },
      fixed: {
        enabled: false,
        position: "topRight",
        offsetY: 30,
      },
      marker: {
        show: false,
      },
      fillSeriesColor: false,
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

  return (
    <ChartWrap
      title={`Top 10 ${getDropdownLabel(dropdownValue)}s`}
      classNames={className}
      dropdownOptions={dropdownOptions}
      onDropdownChange={handleDropdownChange}
      defaultDropdownValue={defaultDropdownValue}
    >
      {spotifyData && (
        <ApexCharts
          options={BarGraphOption}
          series={spotifyData ? spotifyData : []}
          type="bar"
          height={height ? height : ""}
        />
      )}
    </ChartWrap>
  );
}

const CATEGORIES = [
  {
    category: "artist",
    groupings: ["artist", "artist_id"],
  },
  {
    category: "main_genre",
    groupings: ["main_genre"],
  },
  {
    category: "secondary_genre",
    groupings: ["secondary_genre"],
  },
  {
    category: "song",
    groupings: ["song"],
  },
  {
    category: "album",
    groupings: ["album"],
  },
  {
    category: "genre_category",
    groupings: ["genre_category"],
  },
];

function getDropdownLabel(category: string) {
  const words = category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  return words.join(" ");
}

const dropdownOptions = CATEGORIES.map((cat) => {
  return { value: cat.category, label: getDropdownLabel(cat.category) };
});

function getDropdownGroupings(category: string) {
  const grouping = CATEGORIES.find(
    (cat) => cat.category === category
  ).groupings;
  return grouping;
}
