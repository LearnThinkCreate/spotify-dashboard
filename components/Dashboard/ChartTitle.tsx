"use client";
interface ChartTitleProps {
    title: string;
  }

const ChartTitle = ({ title }: ChartTitleProps) => {

    return (
        <h3 className="text-xl font-semibold text-black dark:text-white text-center">
          {title}
        </h3>   
    );
};

export default ChartTitle;