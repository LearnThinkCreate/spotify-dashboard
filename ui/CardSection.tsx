import React, { ReactNode } from 'react';
import querySpotifyData from '@/db/querySpotifyData';
import { generateDateFilters } from '@/db/utils';
import CardDataStats from './CardDataSeries';
import getGenreIcon from "./genre_icons";

export default async function CardSection({
    searchParams
}: {
    searchParams?: any
}) {

    const cardCategories = [
        // 'main_genre', 'secondary_genre', '', 'artist'
        { category: '', icon: getGenreIcon("funk"), header: '# Hours Played: ', subheader: ''},
        { category: 'main_genre', icon: getGenreIcon("funk"), header: 'Top Genre: ', subheader: 'Hours Played: '},
        { category: 'secondary_genre', icon: getGenreIcon("funk"), header: 'Top  Sub-Genre: ', subheader: 'Hours Played: '},
        { category: 'artist', icon: getGenreIcon("funk"), header: 'Top Artist: ', subheader: 'Hours Played: '},
    ];

    const year = searchParams["year"] ? Number(searchParams["year"]) : null;
    const month = searchParams["month"] ? Number(searchParams["month"]) : null;
    const dateFilters = generateDateFilters(month, year);
    const timeDuration = dateFilters ? dateFilters.sum_units : "hours";
    let timeSelection = timeDuration === "hours" ? "hours_played" : "minutes_played";

    function getCardData(category: string) {
        let defaultFilters = [];
        if (category !== '') {
            defaultFilters.push(`${category} IS NOT NULL`);
            defaultFilters.push(`${category} != ''`);
        }

        if (dateFilters.dateFilter !== null) {
            defaultFilters.push(dateFilters.dateFilter);
        }
        let fields = [`SUM(${timeSelection}) AS ${timeSelection}`];
        if (category !== '') {
            fields.unshift(category);
        }

        return querySpotifyData({
            fields: fields,
            filters: defaultFilters.length > 0 ? defaultFilters : [],
            groupings: category === '' ? undefined : [category],
            orderBy: [`${timeSelection} DESC`],
            limit: 1,
            returnType: 'graph',
            graphColumns: {
                category: "",
                x_axis: category,
                y_axis: timeSelection,
            }
        });
    }

    const cardData = await Promise.all(
      cardCategories.map((category) => {
        return getCardData(category.category);
      })
    );

    return (
        <div className="col-span-12  xl:col-span-6 flex">
            <div className="grow grid grid-cols-2 gap-4 xl:grid-cols-2 xl:grid-rows-2">
                {cardData.map((data: any, index: number) => {
                    return (
                        <div className="col-span-1 flex">
                            <CardDataStats 
                            subheader={cardCategories[index].subheader + (cardCategories[index].subheader ? data[0]['data'][0]['y'] : '')} 
                            header={cardCategories[index].header + (data[0]['data'][0]['x']  ? data[0]['data'][0]['x'] : data[0]['data'][0]['y'] )}  >
                                {getGenreIcon("funk")}
                            </CardDataStats>
                        </div>
                    )
                })}
            </div>
        </div>
    )
    
}