import pg from "pg";

export type acceptableTableTypes = "data-table" | "table-two";

export type GraphData = {
  x: number | string;
  y: number | string;
};

export type GraphSeries = {
  name: string;
  data: GraphData[];
}[];

export type validReturnTypes = "graph" | "data-table" | "table-two" | "";

export type GraphColumns = {
  category: string;
  x_axis: string | number;
  y_axis: string | number;
};
type QueryFilter = {
  field: string;
  value: string;
  operator: string;
};

export function addItemToGraph(graph, category, x_axis, y_axis) {
  const existingItem = graph.find((item) => item.name === category);
  if (existingItem) {
    existingItem.data.push({ x: x_axis, y: y_axis });
  } else {
    graph.push({
      name: category,
      data: [{ x: x_axis, y: y_axis }],
    });
  }
}

interface formatColumnValuesParams {
  data: pg.Result;
  tableType: acceptableTableTypes;
}

export function formatColumnValues({
  data,
  tableType,
}: formatColumnValuesParams) {
  let tableColumn = [];

  function formatColumnTitle(title) {
    return title
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  if (tableType === "data-table") {
    tableColumn = data.fields.map((field) => ({
      Header: formatColumnTitle(field.name),
      accessor: field.name,
    }));
  } else if (tableType === "table-two") {
    tableColumn = data.fields.map((field) => ({
      label: formatColumnTitle(field.name),
      key: field.name,
    }));
  }

  return tableColumn;
}

interface formatQueryReturnParams {
  data: any;
  returnType: validReturnTypes;
  graphColumns?: GraphColumns;
}
export function formatQueryReturn({
  data,
  returnType = "",
  graphColumns: { category, x_axis, y_axis } = {
    category: "",
    x_axis: "",
    y_axis: "",
  },
}: formatQueryReturnParams) {
  if (returnType === "graph") {
    const graph: GraphSeries = [];

    data.rows.forEach((item: any) => {
      addItemToGraph(graph, item[category], item[x_axis], Number(item[y_axis]));
    });

    return graph;
  } else if (returnType === "") {
    return data;
  } else if (["data-table", "table-two"].includes(returnType)) {
    const table_columns = formatColumnValues({
      data: data,
      tableType: returnType,
    });

    return {
      data: data.rows,
      columns: table_columns,
    };
  }
}

interface createQueryFiltersParams {
  filters: QueryFilter[];
}
export function createQueryFilters({ filters }: createQueryFiltersParams) {
  if (filters.length > 0) {
    return `WHERE ${filters
      .map((filter) => `${filter.field} ${filter.operator} ${filter.value}`)
      .join(" AND ")}`;
  } else {
    return "";
  }
}
