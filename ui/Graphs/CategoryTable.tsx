import ReusableDataTable from "@/components/Datatables/ReusableDataTable";
import { generateDateFilters, formatColumnValues } from "@/db/utils";
import query from "@/db";

export default async function CategoryTable({
    month,
    year,
    classNames
}: {
    month: number;
    year: number;
    classNames: string;
}) {
    const category = 'artist';

    const dateFilters = generateDateFilters(month, year);

    const timeDuration = dateFilters ? dateFilters.sum_units : 'hours';

    const timeSelection = timeDuration === 'hours' ? 'hours_played' : 'minutes_played';

    const sqlQuery = `
        SELECT
            ${category},
            ROUND(SUM(${timeSelection})::numeric, 2) AS ${timeSelection}
        FROM spotify_data_overview
        WHERE (${category} IS NOT NULL AND ${category} != '') 
        ${dateFilters.dateFilter ? `AND (${dateFilters.dateFilter})` : ''}
        GROUP BY ${CATEGORIES.find((cat) => cat.category === category).groupings.join(', ')}
        ORDER BY ${timeSelection} DESC
        LIMIT 50
    `;

    const data = await query(sqlQuery);

    // Convert each row[category] title case
    data.rows.forEach((row) => {
        row[category] = row[category] ? row[category].replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'Unknown';
    });

    return (
        <div className={classNames}>
            <ReusableDataTable
                data={data.rows}
                columns={ formatColumnValues({ data }) }
                defaultPageSize={5}
            />
        </div>
    );
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
    }
]