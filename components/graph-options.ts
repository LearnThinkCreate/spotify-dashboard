
import {  
    percentFormatter, 
    decibelFormatter, 
    tempoFormatter,
    hoursFormatter,
} from '@/components/graph-utils';
import { toTitleCase } from '@/lib/utils';

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
        scale: [0, 1],
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    {
        value: 'danceability',
        label: 'Danceability',
        description: 'This graph shows the median danceability of songs by year.',
        scale: [0, 1],
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    { 
        value: 'instrumental', 
        label: 'Instrumentalness',
        description: 'Percentage of songs that are instrumental',
        labelFormatter: (value: string, name: string) => [percentFormatter(value), name],
        tickFormatter: (value: string) => percentFormatter(value)
    },
    {
        value: 'loudness',
        label: 'Loudness',
        description: 'This graph shows the median loudness of songs by year.',
        scale: null,
        labelFormatter: (value: string, name: string) => [decibelFormatter(value), name],
        tickFormatter: (value: string) => parseFloat(value).toFixed(0) + "dB"
    },
    {
        value: 'tempo',
        label: 'Tempo',
        description: 'This graph shows the median tempo of songs by year.',
        scale: null,
        labelFormatter: (value: string, name: string) => [tempoFormatter(value), name],
        tickFormatter: (value: string) => parseFloat(value).toFixed(0) + 'BPM'
    },
    {
        value: 'hours_played',
        label: 'Hours Per Day',
        description: 'This graph shows the median hours played per day of songs by year.',
        scale: null,
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