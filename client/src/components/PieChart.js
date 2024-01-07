// components/PieChart.js
import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const PieChart = ({ chartData }) => {
    const chartOptions = {
        labels: chartData.map(item => item.name),
        colors: chartData.map(item => item.color),
        chart: {
            height: 380,
            width: 380,
            type: 'donut',
        },
        legend: {
            position: 'left', // Position the legend on the left side
        },
    };

    const seriesData = chartData.map(item => item.share);

    return (
        <div>
            <Chart
                options={chartOptions}
                series={seriesData}
                type="donut"
                height={380}
                width={380}
            />
        </div>
    );
};

export default PieChart;
