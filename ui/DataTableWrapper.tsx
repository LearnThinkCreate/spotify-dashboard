import querySpotifyData from "@/db/querySpotifyData";
import ReusableDataTable from "@/components/Datatables/ReusableDataTable";

export default async function DataTableWrapper({
    defaultDropdownValue='main_genre'
}) {
    
        const initialData = await querySpotifyData({
            fields:[ defaultDropdownValue, 'SUM(hours_played) AS hours_played' ],
            filters: [`${defaultDropdownValue} IS NOT NULL`, `${defaultDropdownValue} != ''`],
            groupings: [defaultDropdownValue],
            orderBy: ['hours_played DESC'],
            limit: 50,
            returnType: 'data-table',
        });
    
        return (
            <ReusableDataTable
                data={initialData.data}
                columns={initialData.columns}
                defaultPageSize={5}
                defaultDropdownValue={defaultDropdownValue}
            />
        )
}