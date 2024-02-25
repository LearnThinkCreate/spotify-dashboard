import querySpotifyData from "@/db/querySpotifyData";
import BarChart from "@/components/Charts/BarChart";

export default async function BarChartWrapper({
    height,
    chartId,
    defaultDropdownValue = 'song'
}: {
    height?: number,
    chartId?: string,
    defaultDropdownValue?: string
}) {

    const initialData = await querySpotifyData({
        fields:[ defaultDropdownValue, 'SUM(hours_played) AS hours_played' ],
        filters: [`${defaultDropdownValue} IS NOT NULL`, `${defaultDropdownValue} != ''`],
        groupings: [defaultDropdownValue],
        orderBy: ['hours_played DESC'],
        limit: 10,
        returnType: 'graph',
        graphColumns: {
            category: "",
            x_axis: defaultDropdownValue,
            y_axis: "hours_played",
        }
    });

    return (
        <BarChart
            height={height}
            chartId={chartId}
            defaultDropdownValue={defaultDropdownValue}
            series={initialData}
        />
    )

}