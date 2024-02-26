import BarChart from "@/components/Charts/BarChart";
import { generateDateFilters } from "@/db/utils";
import querySpotifyData from "@/db/querySpotifyData";
import { GraphComponentProps } from "@/ui/Graphs/definitions";
import { GraphSeries } from "@/components/Charts/definitions";

export default async function CategoryBarChart({
    month,
    year,
    classNames,
    title = '',
    height = null,
    // category = 'song',
    chartId = '',
    limit = 6,
    unitTime = 'hours_played'
}: GraphComponentProps
) {
    const category = 'song'

    const dateFilters = generateDateFilters(month, year);

    let timeSelection;

    if (unitTime) {
        timeSelection = unitTime;
    } else {
        const timeDuration = dateFilters ? dateFilters.sum_units : "hours";
        timeSelection = timeDuration === "hours" ? "hours_played" : "minutes_played";
    }

    const data = await querySpotifyData({
        fields: [category, `SUM(${timeSelection}) AS ${timeSelection}`],
        filters: dateFilters.dateFilter ? [dateFilters.dateFilter] : [],
        groupings: CATEGORIES.find((cat) => cat.category === category).groupings,
        orderBy: [`${timeSelection} DESC`],
        limit: limit,
        returnType: "graph",
        graphColumns: {
            category: "",
            x_axis: category,
            y_axis: timeSelection,
        }
    });


    return (
        <BarChart
            className={classNames}
            // series={data}
            title={title ? title : `Top ${limit} ${category}s`}
            height={height}
            chartId={chartId}
            yaxisTitle={unitTime === 'hours_played' ? 'Hours' : 'Minutes'}
            dropdownOptions={dropdownOptions}
            onDropdownChange={null}
            defaultDropdownValue={category}
        />
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
    },
    {
        category: 'album', groupings: ['album']
    },
    {
        category: 'genre_category', groupings: ['genre_category']
    }
];

const dropdownOptions = CATEGORIES.map((cat) => {
    const words = cat.category.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return { value: cat.category, label: words.join(' ') };
});