
import dynamic from 'next/dynamic';
import ChartWrap from '@/components/Charts/ChartWrap';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

export default function ChartLoading({title, subtitle, type = 'line', classNames ='', height}: {
    title?: string, 
    subtitle?: string, 
    type?: 'line' | 'area' | 'bar' | 'pie' | 'donut' | 'radialBar' | 'scatter' | 'bubble' | 'heatmap' | 'candlestick' | 'boxPlot' | 'radar' | 'polarArea' | 'rangeBar' | 'rangeArea' | 'treemap', 
    classNames?: string, 
    height?: number
}) {
    return (
        <ChartWrap title={title} subtitle={subtitle} classNames={classNames}>
            <div className="flex" />
        </ChartWrap>
    );
}
