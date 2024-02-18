export type GraphData = {
    x: number | string;
    y: number | string;
};

export type GraphSeries = {
    name: string;
    data: GraphData[];
  }[];

