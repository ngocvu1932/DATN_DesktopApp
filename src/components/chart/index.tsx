import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  BarController,
  LineController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import {Chart, Bar, Line, Pie, Doughnut, Radar} from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  RadarController,
  BarController,
  LineController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  type: ETypeChart;
}

export enum ETypeChart {
  BAR = 'BAR',
  LINE = 'LINE',
  PIE = 'PIE',
  COMBO = 'COMBO',
  DOUGHNUT = 'DOUGHNUT',
  RADAR = 'RADAR',
}

const BarChart: React.FC<BarChartProps> = ({type}) => {
  const dataBar = {
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

  const dataCombo = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        type: 'bar' as const,
        label: 'Sales 2024 (in USD)',
        data: [3000, 2000, 1500, 5000, 7000, 4000, 6000],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        type: 'line' as const,
        label: 'Trend Line',
        data: [3200, 2100, 1600, 4800, 6700, 4500, 6200],
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
        fill: false,
      },
    ],
  };

  const dataPie = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const dataDoughnut = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        data: [350, 75, 150],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      },
    ],
  };

  const dataRadar = {
    labels: ['Speed', 'Reliability', 'Comfort', 'Safety', 'Efficiency'],
    datasets: [
      {
        label: 'Car A',
        data: [65, 59, 90, 81, 56],
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      },
      {
        label: 'Car B',
        data: [28, 48, 40, 19, 96],
        fill: true,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        pointBackgroundColor: 'rgba(153, 102, 255, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(153, 102, 255, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Chart',
      },
    },
  };

  // Render logic based on type
  if (type === ETypeChart.BAR) {
    return <Bar data={dataBar} options={options} />;
  } else if (type === ETypeChart.LINE) {
    return <Line data={dataBar} options={options} />;
  } else if (type === ETypeChart.PIE) {
    return <Pie data={dataPie} options={options} />;
  } else if (type === ETypeChart.COMBO) {
    return <Chart type="bar" data={dataCombo} options={options} />;
  } else if (type === ETypeChart.DOUGHNUT) {
    return <Doughnut data={dataDoughnut} options={options} />;
  } else if (type === ETypeChart.RADAR) {
    return <Radar data={dataRadar} options={options} />;
  } else {
    return <div>Not found</div>;
  }
};

export default BarChart;
