import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const LineChart = () => {
    const data = {
        labels: ['January', 'February', 'March', 'April'],
        datasets: [
            {
                label: 'Possession',
                data: [0, 4, 5, 2],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Monthly Possession',
            },
        },
    };

    return (
        <Line data={data} options={options} />
  )
};

export default LineChart;