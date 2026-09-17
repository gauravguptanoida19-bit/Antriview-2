import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { PerformanceTrendItem } from '../../types';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PerformanceTrendChartProps {
  data: PerformanceTrendItem[];
}

export const PerformanceTrendChart: React.FC<PerformanceTrendChartProps> = ({ data }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-gray-500">
        No completed interview data yet to plot trend.
      </div>
    );
  }

  const labels = data.map((item, idx) => `Session #${idx + 1}`);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Overall Score',
        data: data.map((d) => d.overallScore),
        borderColor: '#22c55e', // brand emerald
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#22c55e',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
      },
      {
        label: 'Technical Depth',
        data: data.map((d) => d.technicalScore),
        borderColor: '#3b82f6', // blue
        backgroundColor: 'transparent',
        borderDash: [5, 5],
        tension: 0.35,
        pointBackgroundColor: '#3b82f6',
      },
      {
        label: 'Coding Proficiency',
        data: data.map((d) => d.codingScore),
        borderColor: '#a855f7', // purple
        backgroundColor: 'transparent',
        borderDash: [2, 2],
        tension: 0.35,
        pointBackgroundColor: '#a855f7',
      },
    ],
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDark ? '#9ca3af' : '#4b5563',
          font: { family: 'Inter', size: 12 },
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: isDark ? '#111827' : '#ffffff',
        titleColor: isDark ? '#f9fafb' : '#111827',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        boxPadding: 4,
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: isDark ? '#6b7280' : '#9ca3af',
          font: { family: 'Inter', size: 11 },
          stepSize: 20,
        },
        grid: {
          color: isDark ? 'rgba(55, 65, 81, 0.3)' : 'rgba(229, 231, 235, 0.8)',
        },
      },
      x: {
        ticks: {
          color: isDark ? '#6b7280' : '#9ca3af',
          font: { family: 'Inter', size: 11 },
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="w-full h-72">
      <Line data={chartData} options={options} />
    </div>
  );
};
