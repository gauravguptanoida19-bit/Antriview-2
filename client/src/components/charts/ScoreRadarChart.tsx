import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { RadarItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface ScoreRadarChartProps {
  data: RadarItem[];
}

export const ScoreRadarChart: React.FC<ScoreRadarChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-500">
        No skill analytics data available yet.
      </div>
    );
  }

  const chartData = {
    labels: data.map((d) => d.skill),
    datasets: [
      {
        label: 'Candidate Competency',
        data: data.map((d) => d.score),
        backgroundColor: 'rgba(34, 197, 94, 0.25)',
        borderColor: '#22c55e',
        borderWidth: 2,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#22c55e',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#111827' : '#ffffff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      },
    },
    scales: {
      r: {
        angleLines: {
          color: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.9)',
        },
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.4)' : 'rgba(229, 231, 235, 0.8)',
        },
        pointLabels: {
          color: isDark ? '#9ca3af' : '#4b5563',
          font: { family: 'Inter', size: 11, weight: '500' },
        },
        ticks: {
          display: false,
          min: 0,
          max: 100,
          stepSize: 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Radar data={chartData} options={options} />
    </div>
  );
};
