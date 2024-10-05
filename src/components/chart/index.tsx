import React from 'react';
import {Bar} from 'react-chartjs-2';
import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC = () => {
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Sales 2024 (in USD)',
        data: [3000, 2000, 1500, 5000, 7000, 4000, 6000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      //   legend: {
      //     position: 'bottom', // Sử dụng kiểu PositionType cho legend.position
      //   },
      title: {
        display: true,
        text: 'Monthly Sales Data',
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default BarChart;
