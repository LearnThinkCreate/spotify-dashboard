import { ApexOptions } from "apexcharts";
const LineGraphOption: ApexOptions = {
    legend: {
        show: true,
        position: "top",
        horizontalAlign: "center",
    },
    colors: [
        "#FFD1DC", // Pastel Pink
        "#B4F8C8", // Pastel Green
        "#A7C7E7", // Pastel Blue
        "#FFFACD", // Pastel Yellow
        "#B5A4CC", // Pastel Purple
        "#FDBA96", // Pastel Orange
        "#E6E6FA", // Pastel Lavender
        "#BFFCC6", // Pastel Mint
        "#FED7B0", // Pastel Peach
        "#B2D8D8"  // Pastel Teal
    ],
    chart: {
        fontFamily: "Satoshi, sans-serif",
        height: 200,
        toolbar: {
            show: false,
        },
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
            text: 'Hours',
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
export default LineGraphOption;