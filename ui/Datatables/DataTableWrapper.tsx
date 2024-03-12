import { searchSpotifyData } from "@/lib/db/querySpotifyData";
import ReusableDataTable from "@/ui/Datatables/ReusableDataTable";

export default async function DataTableWrapper({
    defaultDropdownValue='main_genre'
}) {
    
        const initialData = await searchSpotifyData({
            fields:[ defaultDropdownValue, 'SUM(hours_played) AS hours_played' ],
            filters: [`${defaultDropdownValue} IS NOT NULL`, `${defaultDropdownValue} != ''`],
            groupings: [defaultDropdownValue],
            orderBy: ['hours_played DESC'],
            limit: 50,
        });
    
        return (
            <></>
            // <ReusableDataTable
            //     data={initialData.data}
            //     columns={initialData.columns}
            //     defaultPageSize={5}
            //     defaultDropdownValue={defaultDropdownValue}
            // />
        )
}