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
  tableType?: acceptableTableTypes;
}

export function formatColumnValues({
  data,
  tableType="data-table",
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
      addItemToGraph(graph, item[category], item[x_axis], Number(item[y_axis]).toFixed(0));
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
  filters: string[];
  joinOperator?: string;
}
export function createQueryFilters({ filters, joinOperator='AND' }: createQueryFiltersParams) {
  if (filters.length > 0) {
    return `${filters.join(` ${joinOperator} `)}`;
  } else {
    return "";
  }
}

export function generateDateFilters(month, year): {
  sum_units?: "hours" | "minutes" | null;
  dateFilter?: string | null;

}{
  const minYearDate = 2014;

  // Helper function to create date filter string in SQL syntax
  function getDateFilterString(start, end) {
    return `(ts > '${start.toISOString()}' AND ts < '${end.toISOString()}')`;
  }

  // When both month and year are null
  if (month == null && year == null) {
    return { sum_units: 'hours', dateFilter: null };
  }

  // Current date for calculations
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();

  // When only year is provided
  if (year != null && month == null) {
    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year + 1, 0, 1);
    return { sum_units: 'hours', dateFilter: getDateFilterString(startOfYear, endOfYear) };
  }

  // When only month is provided
  if (month != null && year == null) {
    let dateFilters = [];
    for (let yr = minYearDate; yr <= currentYear; yr++) {
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 1);
      dateFilters.push(getDateFilterString(startOfMonth, endOfMonth));
    }
    return { sum_units: 'hours', dateFilter: `(${dateFilters.join(' OR ')})` };
  }

  // When both month and year are provided
  if (month != null && year != null) {
    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 1);
    return { sum_units: 'minutes', dateFilter: getDateFilterString(startOfMonth, endOfMonth) };
  }
}
