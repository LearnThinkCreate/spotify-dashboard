import React, { ReactNode } from 'react';

interface CardDataStatsProps {
  subheader: string;
  header: string;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  subheader,
  header,
  children,
}) => {
  return (
    <div className="grow grid grid-cols-1 place-content-center rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex justify-center mb-2">
        {children}
      </div>

      <div className="">
        <div className="grid grid-cols-1 items-center"> 
          <h4 className="text-title-md font-bold text-black dark:text-white text-center mb-1 xl:text-title-lg">
            {header}
          </h4>
          <span className="text-sm font-medium text-center xl:text-base">{subheader}</span>
        </div>


      </div>
    </div>
  );
};

export default CardDataStats;
