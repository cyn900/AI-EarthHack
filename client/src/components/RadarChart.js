// components/RadarChart.js
import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RadarChart = ({ chartData }) => {
    const chartOptions = {
        labels: chartData.map(item => item.name),
        colors: chartData.map(item => item.color),
        chart: {
            height: 380,
            width: 380,
            type: 'radar',
            toolbar: {
                show: false,
            },
        },
        markers: {
            size: 4,
        },
        dataLabels: {
            enabled: true,
        },
    };

    const seriesData = [{
        name: 'Share',
        data: chartData.map(item => item.share * 100),
    }];

    return (
        <div>
            <Chart
                options={chartOptions}
                series={seriesData}
                type="radar"
                height="380"
                width="380"
            />
        </div>
    );
};

export default RadarChart;
