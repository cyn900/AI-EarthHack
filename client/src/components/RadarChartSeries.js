import React from 'react';
import dynamic from 'next/dynamic';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const RadarChartSeries = ({ chartData }) => {
    const chartOptions = {
        chart: {
            height: 350,
            type: 'radar',
            dropShadow: {
                enabled: true,
                blur: 1,
                left: 1,
                top: 1
            },
            toolbar: {
                show: false
            }
        },
        title: {
            text: 'Radar Chart - ' + chartData.pillarName,
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
        }
    };

    return (
        <div>
            <Chart
                options={chartOptions}
                series={chartData.series}
                type="radar"
                height="380"
                width="380"
            />
        </div>
    );
};

export default RadarChartSeries;
