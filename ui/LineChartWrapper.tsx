import qualifyingAnnualData from "@/db/qualifyingAnnualData";
import LineChart from "@/components/Charts/LineChart";


export default async function LineChartWrapper({
    height,
    chartId,
    defaultDropdownValue = 'main_genre'
}: {
    height?: number,
    chartId?: string,
    defaultDropdownValue?: string
}) {

    const initialData = await qualifyingAnnualData({
        fields:[ defaultDropdownValue ],
        returnType: 'graph',
        limit: 10,
        minYears: 8,
        timeSelection: 'hours_played',
        dateGrouping: 'year',
        filters: [],
    });


    return (
        <LineChart
            height={height}
            chartId={chartId}
            defaultDropdownValue={defaultDropdownValue}
            series={initialData}
        />
    )

}