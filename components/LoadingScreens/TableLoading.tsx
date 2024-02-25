import ReusableDataTable from "@/components/Datatables/ReusableDataTable";

export default function TableLoading({ classNames }: { classNames: string }) {
    const emptyChartColumns = [
        {
            Header: 'Spotify',
            accessor: 'x'
        },
        {
            Header: 'Data',
            accessor: 'y'
        }
    ];
    const emptyChartData = [
        {
            x: 'Loading...',
            y: 0
        },
        {
            x: 'Awesomeness',
            y: 100
        }
    ];

    return (
        <div className={classNames}>
            <ReusableDataTable data={emptyChartData} columns={emptyChartColumns}></ReusableDataTable>
        </div>
    )
}