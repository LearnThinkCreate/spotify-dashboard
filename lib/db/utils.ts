

export const generateDateFilters = () => {}

export const formatQueryFilters = ({ filters, joinOperator }) => {}

export const formatParams = ({ params }: {
    params: string[]
}) => {
    if (params.length === 0) {
        return '';
    }
    return params.join(', ')
}

export const formatAggParams = ({ aggFunc, params }: {
    aggFunc: string,
    params: string[]
}) => {
    return params.length === 0 
    ? '' : 
    params.map(param => `${aggFunc}( ${param} ) as ${param}`).join(', ')
};

export const insertCte = () => {}

export const basicBarQuery = ({
  category = "artist",
  limit = 5,
  offset = 0,
  filter = "",
}: {
  category?: string;
  limit?: number;
  offset: number;
  filter: string;
}) => {
  return `
    select 
        ${category}, sum(hours_played) as hours_played
    from 
        spotify_data_overview
    ${filter ? `where ${filter}` : ""}
    group by 
        ${category}
    order by 
        hours_played desc
    limit 
        ${limit}
    offset 
        ${offset}
    `;
};

export const basicLineQuery = ({
    category = 'energy',
    dateGroup = 'year',
    table = 'spotify_data_overview',
    filter = '',
}: {
    category?: string,
    dateGroup?: string,
    table?: string,
    filter?: string
}) => {
    return `
    select 
        SUM(${category} * hours_played) / SUM(hours_played) as average_value,
        sum(hours_played) as hours_played, ${dateGroup}
    from
        ${table}
    ${filter ? `where ${filter}` : ''}
    group by 
        ${dateGroup}
    `;
}