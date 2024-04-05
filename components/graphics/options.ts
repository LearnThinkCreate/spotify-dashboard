
import {  
    percentFormatter, 
    decibelFormatter, 
    tempoFormatter,
    hoursFormatter,
} from '@/components/graphics/utils';
import { toTitleCase } from '@/lib/utils';
import * as dbUtils from '@/lib/db/utils';

type GraphOption = {
    value: string,
    label: string,
    description: string,
    lineKey?: string,
    customQuery?: (filter: string) => string,
    scale?: number[],
    labelFormatter?: (value: string, name: string) => any,
    tickFormatter?: (value: string) => string,
    test?: string,
    
}

const LineGraphOptions: GraphOption[] = [
    { 
        value: 'energy', 
        label: 'Energy',
        description: 'This graph shows the median energy of songs by year.',
        lineKey: 'average_value',
        scale: [0, 1],
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    {
        value: 'danceability',
        label: 'Danceability',
        description: 'This graph shows the median danceability of songs by year.',
        lineKey: 'average_value',
        scale: [0, 1],
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    { 
        value: 'instrumentalness', 
        label: 'Instrumentalness',
        description: 'Percentage of songs that are instrumental',
        lineKey: 'average_value',
        customQuery: (filter: string) => `
        WITH instrumentalData AS (
            select
                track_id,
            Case 
                when instrumentalness >= 0.5 then 1
                else 0
            end as instrumental
            from track_metadata
        )
        select 
            (SUM(instrumental * hours_played) / SUM(hours_played)) AS average_value,
            year
        from 
            spotify_data_overview
        Join instrumentalData ON spotify_data_overview.track_id = instrumentalData.track_id
        ${filter ? `where ${filter}` : ''}
        group by
            year
        `,
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    {
        value: 'loudness',
        label: 'Loudness',
        description: 'This graph shows the median loudness of songs by year.',
        lineKey: 'average_value',
        scale: null,
        labelFormatter: (value: string, name: string) => [decibelFormatter(value), name],
        tickFormatter: (value: string) => parseFloat(value).toFixed(0) + "dB"
    },
    {
        value: 'tempo',
        label: 'Tempo',
        description: 'This graph shows the median tempo of songs by year.',
        lineKey: 'average_value',
        scale: null,
        labelFormatter: (value: string, name: string) => [tempoFormatter(value), name],
        tickFormatter: (value: string) => parseFloat(value).toFixed(0) + 'BPM'
    },
    {
        value: 'hours_played_per_day',
        label: 'Hours Per Day',
        description: 'This graph shows the median hours played per day of songs by year.',
        lineKey: 'average_value',
        customQuery: (filter: string) => `
        With year_days AS (
            select 
            CASE
                WHEN EXTRACT(DOY FROM min(ts)) < 15 THEN 1
                ELSE EXTRACT(DOY FROM min(ts))
            END AS min_day, 
            CASE
                WHEN EXTRACT(DOY FROM max(ts)) < 15 THEN 1
                ELSE EXTRACT(DOY FROM max(ts))
            END AS max_day, 
            year
            from spotify_data_overview
            ${filter ? `where ${filter}` : ''}
            group by year
        ), HoursPlayed AS (
            Select SUM(hours_played) as hours_played, year
            from spotify_data_overview
            ${filter ? `where ${filter}` : ''}
            group by year
        )
        Select 
            HoursPlayed.year, 
            (hours_played / (max_day - (min_day - 1))) as average_value
        from HoursPlayed
        JOIN year_days ON HoursPlayed.year = year_days.year
        `,
        scale: [0, 6.5],
        labelFormatter: (value: string, name?: string) => [hoursFormatter(value), name || ''],
        tickFormatter: (value: string) => parseFloat(value).toFixed(0)
    }

];

const BarGraphOptions: GraphOption[] = [
    { 
        value: 'artist', 
        label: 'Artist',
        description: 'This graph show my favorite artist',
        lineKey: 'hours_played',
        test: `
        Select ${ dbUtils.formatParams({ params: ['artist'] }) + ', ' + dbUtils.formatAggParams({ aggFunc: 'sum', params: ['hours_played'] }) }
        `,
        labelFormatter: (value: string, name: string) => [parseFloat(value).toFixed(0)]
    },
    {
        value: 'song',
        label: 'Song',
        description: 'This graph shows my favorite songs',
        lineKey: 'hours_played',
        labelFormatter: (value: string, name: string) => [parseFloat(value).toFixed(0), name]
    },
    { 
        value: 'album', 
        label: 'Album',
        description: 'This graph shows my favorite albums',
        lineKey: 'hours_played',
        labelFormatter: (value: string, name: string) => [parseFloat(value).toFixed(0), name]
    },
    {
        value: 'main_genre',
        label: 'Genre',
        description: 'This graph shows my favorite genres',
        lineKey: 'hours_played',
        labelFormatter: (value: string, name: string) => [hoursFormatter(value), name],
        tickFormatter: (value: string) => toTitleCase(String(value))
    },
    {
        value: 'secondary_genre',
        label: 'Sub-Genre',
        description: 'This graph shows my favorite sub-genres',
        lineKey: 'hours_played',
        labelFormatter: (value: string, name: string) => [parseFloat(value).toFixed(0), name],
        tickFormatter: (value: string) => toTitleCase(String(value))
    }
];

const getOptions = (paramValue: string) => {
    if (paramValue === 'historyValue') {
        return LineGraphOptions;
    }
    return BarGraphOptions;
}

export { LineGraphOptions, BarGraphOptions, getOptions };
export type { GraphOption };