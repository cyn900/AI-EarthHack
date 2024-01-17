import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RadarChartSingle = ({ chartData }) => {
    const chartOptions = {
        chart: {
            height: 200,
            type: 'radar',
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
            },
            toolbar: {
                show: false
            },

        },
        title: {
            text: chartData.name,
        },
        fill: {
            opacity: 0.1,
        },
        markers: {
            size: 0
        },
        xaxis: {
            categories: chartData.categories
        },
        yaxis: {
            lines: {
                show: true,
            }
        },
        colors: ['#AECE8D'],
    };

    return (
        <div>
            <Chart
                options={chartOptions}
                series={chartData.series}
                type="radar"
                height="250"
                width="250"
            />
        </div>
    );
};

export default RadarChartSingle;
