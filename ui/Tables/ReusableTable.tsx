"use client";
interface TableColumn {
    key: string; // Key in the data object
    label: string; // Display name for the column
    render?: (data: any) => JSX.Element; // Optional render function for custom rendering
  }
  
  interface TableProps {
    data: any[]; // Array of any objects
    columns: TableColumn[]; // Array of columns to display
  }


const ReusableTable: React.FC<TableProps> = ({ data, columns }) => {
return (
    <div className="col-span-12 xl:col-span-7">
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        {/* ...other UI elements like title and dropdown */}

        <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
            {columns.map((column) => (
            <div className="p-2.5 text-center xl:p-4" key={column.key}>
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                {column.label}
                </h5>
            </div>
            ))}
        </div>

        {data.map((item, index) => (
            <div
            className={`grid grid-cols-${columns.length} ${
                index === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
            }`}
            key={index}
            >
            {columns.map((column) => (
                <div className="flex items-center justify-center p-2.5 xl:p-5" key={column.key}>
                {column.render ? column.render(item[column.key]) : <p className="font-medium text-black dark:text-white">{item[column.key]}</p>}
                </div>
            ))}
            </div>
        ))}
        </div>
    </div>
    </div>
);
};
  
export default ReusableTable;